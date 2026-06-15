import { Test, TestingModule } from '@nestjs/testing';
import { TaskStatus, TaskPriority, AgentStatus, ScheduleEntry, TaskResult, OrchestrationConfig } from '@ai-orchestrator/shared';
import { TASK_STORAGE, AGENT_PROVIDER, AgentSessionEvent, CONTEXT_DB, EVENT_BUS, TEST_RUNNER, PR_PROVIDER } from '@ai-orchestrator/core-interfaces';
import { TaskLifecycleService } from './task-lifecycle.service';

describe('TaskLifecycleService', () => {
  let service: TaskLifecycleService;

  const mockTaskStorage = {
    getTask: jest.fn(),
    updateTask: jest.fn(),
    createTask: jest.fn(),
    deleteTask: jest.fn(),
    listTasks: jest.fn(),
    getAvailableTools: jest.fn(),
  };

  const mockAgentProvider = {
    createSession: jest.fn(),
    sendPrompt: jest.fn(),
    getSession: jest.fn(),
    getSessionStatus: jest.fn(),
    listSessions: jest.fn(),
    abortSession: jest.fn(),
    getDiff: jest.fn(),
    grantPermission: jest.fn(),
    onSessionEvent: jest.fn(),
    isConnected: jest.fn().mockReturnValue(true),
    getConnectionError: jest.fn().mockReturnValue(null),
    reconnect: jest.fn(),
  };

  const mockContextDb = {
    getConfig: jest.fn(),
    updateConfig: jest.fn(),
    getSchedule: jest.fn().mockResolvedValue([]),
    addScheduleEntry: jest.fn(),
    updateScheduleEntry: jest.fn(),
    removeScheduleEntry: jest.fn(),
    getTaskSessions: jest.fn().mockResolvedValue([]),
    addTaskSession: jest.fn(),
    updateTaskSession: jest.fn(),
    removeTaskSession: jest.fn(),
    loadAll: jest.fn(),
    saveAll: jest.fn(),
  };

  const mockEventBus = {
    emit: jest.fn(),
    on: jest.fn().mockReturnValue(jest.fn()),
    off: jest.fn(),
  };

  const mockTestRunner = {
    run: jest.fn(),
  };

  const mockPrProvider = {
    createPullRequest: jest.fn(),
    getPullRequest: jest.fn(),
    listPullRequests: jest.fn(),
    mergePullRequest: jest.fn(),
  };

  const mockConfig: OrchestrationConfig = {
    teamId: 'team-1',
    spaceId: 'space-1',
    folderId: 'folder-1',
    listIds: { backlog: 'list-1' },
    mcpServerUrl: 'http://localhost:3000/mcp',
    opencodeServerUrl: 'http://localhost:4096',
    orchestratorPort: 3001,
    projectDirectory: '/tmp/test-project',
    testCommand: 'pnpm test',
    defaultBranch: 'main',
  };

  const mockTask: TaskResult = {
    id: 'task-1',
    name: 'Test Task',
    description: 'A test task',
    status: TaskStatus.Ready,
    priority: 'normal' as TaskPriority,
    listId: 'list-1',
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockContextDb.getConfig.mockResolvedValue(mockConfig);
    mockContextDb.getSchedule.mockResolvedValue([]);
    mockContextDb.getTaskSessions.mockResolvedValue([]);
    mockAgentProvider.onSessionEvent.mockResolvedValue(jest.fn());

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskLifecycleService,
        { provide: TASK_STORAGE, useValue: mockTaskStorage },
        { provide: AGENT_PROVIDER, useValue: mockAgentProvider },
        { provide: CONTEXT_DB, useValue: mockContextDb },
        { provide: EVENT_BUS, useValue: mockEventBus },
        { provide: TEST_RUNNER, useValue: mockTestRunner },
        { provide: PR_PROVIDER, useValue: mockPrProvider },
      ],
    }).compile();

    service = module.get<TaskLifecycleService>(TaskLifecycleService);
  });

  describe('startTask', () => {
    it('should transition a Ready task to InProgress and create an agent session', async () => {
      mockTaskStorage.getTask.mockResolvedValue({ ...mockTask, status: TaskStatus.Ready });
      mockAgentProvider.createSession.mockResolvedValue({
        id: 'session-1',
        taskId: 'task-1',
        status: AgentStatus.Running,
        startedAt: new Date().toISOString(),
      });
      mockTaskStorage.updateTask.mockResolvedValue({ ...mockTask, status: TaskStatus.InProgress });
      mockContextDb.addTaskSession.mockResolvedValue({});
      mockContextDb.updateScheduleEntry.mockResolvedValue({});

      await service.startTask('task-1');

      expect(mockAgentProvider.createSession).toHaveBeenCalledWith(
        expect.objectContaining({
          taskId: 'task-1',
          prompt: expect.stringContaining('Test Task'),
          workingDirectory: mockConfig.projectDirectory,
        }),
      );
      expect(mockTaskStorage.updateTask).toHaveBeenCalledWith('task-1', { status: TaskStatus.InProgress });
      expect(mockContextDb.addTaskSession).toHaveBeenCalledWith(
        expect.objectContaining({
          taskId: 'task-1',
          agentSessionId: 'session-1',
          status: TaskStatus.InProgress,
        }),
      );
      expect(mockEventBus.emit).toHaveBeenCalledWith('task.agent_assigned', expect.any(Object));
    });

    it('should refuse to start a task already being processed', async () => {
      service['processing'] = true;
      service['activeTaskId'] = 'other-task';

      mockTaskStorage.getTask.mockResolvedValue(mockTask);

      await service.startTask('task-1');

      expect(mockAgentProvider.createSession).not.toHaveBeenCalled();
    });

    it('should refuse to start a task with invalid status transition', async () => {
      mockTaskStorage.getTask.mockResolvedValue({ ...mockTask, status: TaskStatus.Done });

      await service.startTask('task-1');

      expect(mockAgentProvider.createSession).not.toHaveBeenCalled();
    });

    it('should refuse to start a task that already has an active session', async () => {
      mockTaskStorage.getTask.mockResolvedValue({ ...mockTask, status: TaskStatus.Ready });
      mockContextDb.getTaskSessions.mockResolvedValue([
        { taskId: 'task-1', agentSessionId: 'session-old', status: TaskStatus.InProgress, assignedAt: '', updatedAt: '' },
      ]);

      await service.startTask('task-1');

      expect(mockAgentProvider.createSession).not.toHaveBeenCalled();
    });

    it('should auto-promote Pending task to Ready before starting', async () => {
      const pendingTask = { ...mockTask, status: TaskStatus.Pending };
      const readyTask = { ...mockTask, status: TaskStatus.Ready };

      mockTaskStorage.getTask
        .mockResolvedValueOnce(pendingTask)
        .mockResolvedValueOnce(pendingTask)
        .mockResolvedValueOnce(pendingTask)
        .mockResolvedValueOnce(readyTask);
      mockTaskStorage.updateTask.mockResolvedValue(readyTask);
      mockAgentProvider.createSession.mockResolvedValue({
        id: 'session-1',
        taskId: 'task-1',
        status: AgentStatus.Running,
        startedAt: new Date().toISOString(),
      });
      mockContextDb.addTaskSession.mockResolvedValue({});
      mockContextDb.updateScheduleEntry.mockResolvedValue({});

      await service.startTask('task-1');

      expect(mockTaskStorage.updateTask).toHaveBeenCalledWith('task-1', { status: TaskStatus.Ready });
      expect(mockTaskStorage.updateTask).toHaveBeenCalledWith('task-1', { status: TaskStatus.InProgress });
      expect(mockAgentProvider.createSession).toHaveBeenCalled();
    });
  });

  describe('prepareTask', () => {
    it('should transition Pending task to Ready', async () => {
      mockTaskStorage.getTask.mockResolvedValue({ ...mockTask, status: TaskStatus.Pending });
      mockTaskStorage.updateTask.mockResolvedValue({ ...mockTask, status: TaskStatus.Ready });
      mockContextDb.updateTaskSession.mockResolvedValue({});

      await service.prepareTask('task-1');

      expect(mockTaskStorage.updateTask).toHaveBeenCalledWith('task-1', { status: TaskStatus.Ready });
      expect(mockEventBus.emit).toHaveBeenCalledWith('task.decomposed', expect.any(Object));
    });

    it('should refuse to prepare a task that is not Pending', async () => {
      mockTaskStorage.getTask.mockResolvedValue({ ...mockTask, status: TaskStatus.InProgress });

      await service.prepareTask('task-1');

      expect(mockTaskStorage.updateTask).not.toHaveBeenCalled();
    });
  });

  describe('reviewTask', () => {
    it('should transition to Completed then Approved then auto-create PR when tests pass', async () => {
      service['activeTaskId'] = 'task-1';

      const taskInProgress = { ...mockTask, status: TaskStatus.InProgress };
      const taskCompleted = { ...mockTask, status: TaskStatus.Completed };
      const taskApproved = { ...mockTask, status: TaskStatus.Approved };

      mockTaskStorage.getTask
        .mockResolvedValueOnce(taskInProgress)
        .mockResolvedValueOnce(taskInProgress)
        .mockResolvedValueOnce(taskCompleted)
        .mockResolvedValueOnce(taskCompleted)
        .mockResolvedValueOnce(taskApproved)
        .mockResolvedValueOnce(taskApproved);
      mockContextDb.getTaskSessions.mockResolvedValue([
        { taskId: 'task-1', agentSessionId: 'session-1', status: TaskStatus.InProgress, assignedAt: '', updatedAt: '' },
      ]);
      mockTestRunner.run.mockResolvedValue({
        exitCode: 0,
        stdout: 'All tests passed',
        stderr: '',
        duration: 5000,
        passed: true,
      });
      mockTaskStorage.updateTask
        .mockResolvedValueOnce(taskCompleted)
        .mockResolvedValueOnce(taskApproved)
        .mockResolvedValueOnce({ ...mockTask, status: TaskStatus.PrCreated });
      mockContextDb.updateTaskSession.mockResolvedValue({});
      mockAgentProvider.getDiff.mockResolvedValue('--- a/file.ts\n+++ b/file.ts');
      mockPrProvider.createPullRequest.mockResolvedValue({
        number: 42,
        url: 'https://github.com/org/repo/pull/42',
        state: 'open',
        head: 'task/task-1',
        base: 'main',
      });

      await service.reviewTask('task-1');

      expect(mockTestRunner.run).toHaveBeenCalledWith(
        expect.objectContaining({
          command: mockConfig.testCommand,
          workingDirectory: mockConfig.projectDirectory,
        }),
      );
      expect(mockTaskStorage.updateTask).toHaveBeenCalledWith('task-1', { status: TaskStatus.Completed });
      expect(mockTaskStorage.updateTask).toHaveBeenCalledWith('task-1', { status: TaskStatus.Approved });
      expect(mockTaskStorage.updateTask).toHaveBeenCalledWith('task-1', { status: TaskStatus.PrCreated });
      expect(mockPrProvider.createPullRequest).toHaveBeenCalled();
    });

    it('should transition to Completed then NeedsRevision when tests fail', async () => {
      service['activeTaskId'] = 'task-1';

      const taskInProgress = { ...mockTask, status: TaskStatus.InProgress };
      const taskCompleted = { ...mockTask, status: TaskStatus.Completed };

      mockTaskStorage.getTask
        .mockResolvedValueOnce(taskInProgress)
        .mockResolvedValueOnce(taskInProgress)
        .mockResolvedValueOnce(taskCompleted);
      mockTaskStorage.updateTask
        .mockResolvedValueOnce(taskCompleted)
        .mockResolvedValueOnce({ ...mockTask, status: TaskStatus.NeedsRevision });
      mockContextDb.getTaskSessions.mockResolvedValue([
        { taskId: 'task-1', agentSessionId: 'session-1', status: TaskStatus.InProgress, assignedAt: '', updatedAt: '' },
      ]);
      mockTestRunner.run.mockResolvedValue({
        exitCode: 1,
        stdout: '1 test failed',
        stderr: '',
        duration: 3000,
        passed: false,
      });
      mockContextDb.updateTaskSession.mockResolvedValue({});

      await service.reviewTask('task-1');

      expect(mockTaskStorage.updateTask).toHaveBeenCalledWith('task-1', { status: TaskStatus.Completed });
      expect(mockTaskStorage.updateTask).toHaveBeenCalledWith('task-1', { status: TaskStatus.NeedsRevision });
    });

    it('should refuse to review a task not in InProgress state', async () => {
      mockTaskStorage.getTask.mockResolvedValue({ ...mockTask, status: TaskStatus.Pending });

      await service.reviewTask('task-1');

      expect(mockTestRunner.run).not.toHaveBeenCalled();
    });
  });

  describe('approveTask', () => {
    it('should transition Completed task to Approved and auto-create PR', async () => {
      service['activeTaskId'] = 'task-1';
      service['processing'] = true;

      const taskCompleted = { ...mockTask, status: TaskStatus.Completed };
      const taskApproved = { ...mockTask, status: TaskStatus.Approved };

      mockTaskStorage.getTask
        .mockResolvedValueOnce(taskCompleted)
        .mockResolvedValueOnce(taskCompleted)
        .mockResolvedValueOnce(taskApproved)
        .mockResolvedValueOnce(taskApproved);
      mockTaskStorage.updateTask
        .mockResolvedValueOnce(taskApproved)
        .mockResolvedValueOnce({ ...mockTask, status: TaskStatus.PrCreated });
      mockContextDb.updateTaskSession.mockResolvedValue({});
      mockContextDb.getTaskSessions.mockResolvedValue([
        { taskId: 'task-1', agentSessionId: 'session-1', status: TaskStatus.Approved, assignedAt: '', updatedAt: '' },
      ]);
      mockAgentProvider.getDiff.mockResolvedValue('--- a/file.ts\n+++ b/file.ts');
      mockPrProvider.createPullRequest.mockResolvedValue({
        number: 42,
        url: 'https://github.com/org/repo/pull/42',
        state: 'open',
        head: 'task/task-1',
        base: 'main',
      });

      await service.approveTask('task-1');

      expect(mockTaskStorage.updateTask).toHaveBeenCalledWith('task-1', { status: TaskStatus.Approved });
      expect(mockTaskStorage.updateTask).toHaveBeenCalledWith('task-1', { status: TaskStatus.PrCreated });
      expect(mockPrProvider.createPullRequest).toHaveBeenCalled();
      expect(service.isProcessing()).toBe(false);
      expect(service.getActiveTaskId()).toBeNull();
    });

    it('should refuse to approve a task not in Completed state', async () => {
      mockTaskStorage.getTask.mockResolvedValue({ ...mockTask, status: TaskStatus.InProgress });

      await service.approveTask('task-1');

      expect(mockTaskStorage.updateTask).not.toHaveBeenCalled();
    });
  });

  describe('createPRForTask', () => {
    it('should create a PR and transition to PrCreated, clearing processing state', async () => {
      service['activeTaskId'] = 'task-1';
      service['processing'] = true;

      mockTaskStorage.getTask.mockResolvedValue({ ...mockTask, status: TaskStatus.Approved });
      mockContextDb.getTaskSessions.mockResolvedValue([
        { taskId: 'task-1', agentSessionId: 'session-1', status: TaskStatus.Approved, assignedAt: '', updatedAt: '' },
      ]);
      mockAgentProvider.getDiff.mockResolvedValue('--- a/file.ts\n+++ b/file.ts');
      mockPrProvider.createPullRequest.mockResolvedValue({
        number: 42,
        url: 'https://github.com/org/repo/pull/42',
        state: 'open',
        head: 'task/task-1',
        base: 'main',
      });
      mockTaskStorage.updateTask.mockResolvedValue({ ...mockTask, status: TaskStatus.PrCreated });
      mockContextDb.updateTaskSession.mockResolvedValue({});

      await service.createPRForTask('task-1');

      expect(mockPrProvider.createPullRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '[Task task-1] Test Task',
          head: 'task/task-1',
          base: mockConfig.defaultBranch,
        }),
      );
      expect(service.isProcessing()).toBe(false);
      expect(service.getActiveTaskId()).toBeNull();
    });

    it('should refuse to create PR for task not in Approved state', async () => {
      mockTaskStorage.getTask.mockResolvedValue({ ...mockTask, status: TaskStatus.InProgress });

      await service.createPRForTask('task-1');

      expect(mockPrProvider.createPullRequest).not.toHaveBeenCalled();
    });
  });

  describe('enqueueTasks', () => {
    it('should add new tasks to the schedule', async () => {
      mockTaskStorage.listTasks.mockResolvedValue([
        { id: 'task-1', name: 'Task 1', description: '', status: TaskStatus.Pending, priority: 'normal', listId: 'list-1', tags: [], createdAt: '', updatedAt: '' },
        { id: 'task-2', name: 'Task 2', description: '', status: TaskStatus.Pending, priority: 'normal', listId: 'list-1', tags: [], createdAt: '', updatedAt: '' },
      ]);
      mockContextDb.getSchedule.mockResolvedValue([]);
      mockContextDb.addScheduleEntry.mockImplementation((entry: ScheduleEntry) => Promise.resolve(entry));

      const result = await service.enqueueTasks('list-1');

      expect(result).toBe(2);
      expect(mockContextDb.addScheduleEntry).toHaveBeenCalledTimes(2);
    });

    it('should skip tasks already in schedule', async () => {
      mockTaskStorage.listTasks.mockResolvedValue([
        { id: 'task-1', name: 'Task 1', description: '', status: TaskStatus.Pending, priority: 'normal', listId: 'list-1', tags: [], createdAt: '', updatedAt: '' },
      ]);
      mockContextDb.getSchedule.mockResolvedValue([
        { taskId: 'task-1', scheduledAt: '', retryCount: 0, maxRetries: 3 },
      ]);

      const result = await service.enqueueTasks('list-1');

      expect(result).toBe(0);
      expect(mockContextDb.addScheduleEntry).not.toHaveBeenCalled();
    });
  });

  describe('dequeueNextTask', () => {
    it('should start the next pending task from the schedule', async () => {
      mockContextDb.getSchedule.mockResolvedValue([
        { taskId: 'task-1', scheduledAt: '', retryCount: 0, maxRetries: 3 },
      ]);
      mockTaskStorage.getTask.mockResolvedValue({ ...mockTask, status: TaskStatus.Ready });
      mockAgentProvider.createSession.mockResolvedValue({
        id: 'session-1',
        taskId: 'task-1',
        status: AgentStatus.Running,
        startedAt: new Date().toISOString(),
      });
      mockTaskStorage.updateTask.mockResolvedValue({ ...mockTask, status: TaskStatus.InProgress });
      mockContextDb.addTaskSession.mockResolvedValue({});
      mockContextDb.updateScheduleEntry.mockResolvedValue({});

      const result = await service.dequeueNextTask();

      expect(result).toBe('task-1');
    });

    it('should return null when no tasks are available', async () => {
      mockContextDb.getSchedule.mockResolvedValue([]);

      const result = await service.dequeueNextTask();

      expect(result).toBeNull();
      expect(mockAgentProvider.createSession).not.toHaveBeenCalled();
    });
  });

  describe('handleAgentEvent', () => {
    it('should auto-approve permission requests', async () => {
      service['activeTaskId'] = 'task-1';
      mockContextDb.getTaskSessions.mockResolvedValue([
        { taskId: 'task-1', agentSessionId: 'session-1', status: TaskStatus.InProgress, assignedAt: '', updatedAt: '' },
      ]);

      const permissionEvent: AgentSessionEvent = {
        type: 'permission.updated',
        sessionId: 'session-1',
        data: { mappedStatus: AgentStatus.WaitingPermission, permissionID: 'perm-1' },
      };

      await service['handleAgentEvent'](permissionEvent);

      expect(mockAgentProvider.grantPermission).toHaveBeenCalledWith('session-1', 'perm-1', 'always');
    });
  });

  describe('getOrchestrationStatus', () => {
    it('should return current status', async () => {
      mockContextDb.getTaskSessions.mockResolvedValue([
        { taskId: 'task-1', agentSessionId: 'session-1', status: TaskStatus.InProgress, assignedAt: '', updatedAt: '' },
        { taskId: 'task-2', agentSessionId: 'session-2', status: TaskStatus.Done, assignedAt: '', updatedAt: '' },
      ]);
      mockContextDb.getSchedule.mockResolvedValue([
        { taskId: 'task-3', scheduledAt: '', retryCount: 0, maxRetries: 3 },
      ]);

      const status = await service.getOrchestrationStatus();

      expect(status.pendingTasks).toBe(1);
      expect(status.activeTasks).toBe(1);
      expect(status.completedTasks).toBe(1);
    });
  });

  describe('terminal state cleanup', () => {
    it('should clear processing and activeTaskId when task reaches NeedsIntervention', async () => {
      service['activeTaskId'] = 'task-1';
      service['processing'] = true;

      const taskInProgress = { ...mockTask, status: TaskStatus.InProgress };

      mockTaskStorage.getTask.mockResolvedValue(taskInProgress);
      mockTaskStorage.updateTask.mockResolvedValue({ ...mockTask, status: TaskStatus.NeedsIntervention });
      mockContextDb.updateTaskSession.mockResolvedValue({});

      await service['advanceTask']('task-1', TaskStatus.NeedsIntervention);

      expect(service.isProcessing()).toBe(false);
      expect(service.getActiveTaskId()).toBeNull();
    });

    it('should clear processing and activeTaskId when task reaches Blocked', async () => {
      service['activeTaskId'] = 'task-1';
      service['processing'] = true;

      const taskReady = { ...mockTask, status: TaskStatus.Ready };

      mockTaskStorage.getTask.mockResolvedValue(taskReady);
      mockTaskStorage.updateTask.mockResolvedValue({ ...mockTask, status: TaskStatus.Blocked });
      mockContextDb.updateTaskSession.mockResolvedValue({});

      await service['advanceTask']('task-1', TaskStatus.Blocked);

      expect(service.isProcessing()).toBe(false);
      expect(service.getActiveTaskId()).toBeNull();
    });
  });
});