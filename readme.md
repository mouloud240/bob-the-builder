
# AI-ORCHESTRATION SYSTEM

## Overview
An internal AI orchestration system that automates software development workflows by ingesting Product Requirement Documents (PRDs), decomposing them into executable tasks, and coordinating multiple AI agents to complete development work. The system leverages existing CLI tools (primarily OpenCode, with future support for Claude Code and Copilot Code) and provides human oversight at critical decision points.

---

## System Architecture

### Core Components

#### 1. Project Manager Agent
- Analyzes Product Requirement Documents
- Creates project plans with milestones and deliverables
- Breaks down milestones into granular, executable tasks
- Defines task dependencies for proper execution ordering
- Reviews completed task deliverables
- Creates pull requests for engineering team review
- Monitors Task Storage for updates and provides feedback

#### 2. Task Storage (Persistent)
- Stores all tasks with metadata (status, dependencies, session_id)
- Tracks task states: `pending`, `in_progress`, `needs_intervention`, `completed`, `failed`
- Maintains human intervention requests (questions, permission requests)
- Preserves full audit trail of task lifecycle
- Enables state recovery across system restarts via session_id

##
# AI-ORCHASTRATION
 

## Functional requirements

1. The System should take A product requirement document as input  and  generate a project plan with milestones and deliverables.
2. The System should be able to break down the project plan into tasks.
3. The system should be able to ingress tasks and spin up agents to execute the tasks.
4. The system should be able to monitor the progress of the tasks and update the project plan accordingly.
5. The system should be able to generate reports on the progress of the project and identify any potential risks or issues.
6. The system should be able to run  multiple tasks in parallel and manage dependencies between tasks.


## Non-functional requirements




## Scenario
1. A product manager inputs a product requirement document into the system.
2. A specialized **Project manager agent**   break the project plan into milestones and deliverables based on the product requirement document 
3. The project manager agent then breaks down the milestones into tasks and stores them into **Task storage**.
4. The **Orchestrator agent** Reads the tasks from the task storage 
5. The **Orchestrator agent** Calls the **The fork service** to a)create a new worktree for the task b)spin up a new agent to execute the task c)pass the task details to the agent
6. The agent executes the task and writes into the **context database**.
7. The **Watcher service** reacts to changes made to the context database and informs the **Orchestrator agent** about the progress of the task.
8. The **Orchestrator agent** Validates the changes and run tests using **Sprite Test Mcp** 
9. If the tests pass the **Orchestrator agent** marks the task as complete and updates the project plan.
10. If the tests fail the **Orchestrator agent** retries the task by calling the **The fork service** to spin up a new agent to execute the task again.
11. The **project manager agent** reacts to the changes made to the ** Task Storage** and reviews the ticket delivrable and marks the task as complete or adds comments
12. The **Project manager agent** Creates a pull request for the completed task for the engineering team to review and merge.


Ps: **The fork service** , **The Watcher service** are part of a long running golang process

## Communication
### Storage


### Messages Format

### Golang process
- communicate using  Rest Api



## 3. Orchestrator Agent
- Reads tasks from Task Storage
- Implements PERT algorithm to schedule task execution
- Prioritizes tasks with no dependencies first
- Invokes Fork Service to spawn agent instances
- Monitors agent progress via Watcher Service notifications
- Validates completed work by running tests via Sprite Test MCP
- Handles task retries and failure scenarios
- Completes tasks or marks them for human intervention

#### 4. Fork Service (Golang Long-Running Process)
- Creates isolated Git worktrees for each task
- Spawns new agent instances with appropriate CLI tool (OpenCode/Claude Code/Copilot Code)
- Passes task details and context to spawned agents
- Manages worktree lifecycle and cleanup
- Exposes REST API for orchestrator communication

#### 5. Watcher Service (Golang Long-Running Process)
- Monitors Context Database for changes via file system events (push model)
- Detects agent progress updates, completion signals, and error states
- Notifies Orchestrator Agent through file writes
- Tracks concurrent agent activities
- Provides REST API for human interaction and queries

#### 6. Context Database (Persistent)
- Stores execution context for all active agents
- Contains task progress, intermediate results, and agent outputs
- Handles concurrent writes from multiple agents
- Maintains session_id for state tracking and recovery
- Stores agent questions and permission requests for human review
- Preserves error logs and retry attempts

#### 7. Sprite Test MCP
- Executes automated tests on agent-completed work
- Runs unit tests, integration tests, and validation checks
- Reports test results back to Orchestrator
- Provides pass/fail signals for task validation

---

## Functional Requirements

### 1. PRD Ingestion & Planning
- Accept Product Requirement Documents as system input
- Generate comprehensive project plans with milestones and deliverables
- Decompose milestones into atomic, executable tasks
- Define and store task dependencies for execution planning

### 2. Task Orchestration
- Read tasks from Task Storage and analyze dependencies
- Apply PERT algorithm to determine optimal execution order
- Execute independent tasks in parallel to maximize throughput
- Manage task lifecycle from creation to completion
- Handle task failures with automatic retry mechanisms

### 3. Agent Management
- Spawn isolated agent instances per task via Fork Service
- Provide agents with task context and execution environment
- Monitor agent progress through Context Database updates
- Terminate agents gracefully after task completion or failure

### 4. Quality Assurance
- Validate all completed work using Sprite Test MCP
- Execute comprehensive test suites before marking tasks complete
- Trigger automatic retries for failed tests (agent-level retry first)
- Escalate persistent failures to human intervention

### 5. Human-in-the-Loop Interaction
- Enable agents to request permissions or ask clarifying questions
- Mark tasks as `needs_intervention` when human input required
- Provide Watcher API for humans to review and respond to agent queries
- Require human approval for all pull requests before merge
- Allow humans to override task status and provide manual guidance

### 6. Progress Tracking & Reporting
- Monitor real-time progress across all active tasks
- Generate progress reports for project stakeholders
- Identify blocked tasks and dependency bottlenecks
- Surface risks and issues requiring attention

---

## Non-Functional Requirements

### 1. Persistence & State Management
- All storage systems (Task Storage, Context Database) are persistent
- System state fully recoverable using agent session_id
- Support system restarts without losing in-flight work
- Maintain complete audit trail for compliance and debugging

### 2. Reliability
- Agents automatically retry failed operations before escalating
- Context Database captures all error states and retry attempts
- System continues operating even if individual agents fail
- Graceful degradation when non-critical components unavailable

### 3. Observability
- File-based push notifications from Watcher to Orchestrator
- Real-time visibility into agent activities via Context Database
- Comprehensive logging of all system actions
- Human-accessible API for querying system state

### 4. Scalability
- Support multiple concurrent agent instances
- Parallel execution of independent tasks
- Efficient dependency resolution using PERT algorithm
- No resource management constraints (internal tool)

### 5. Extensibility
- Primary CLI tool: OpenCode
- Future support: Claude Code, Copilot Code
- Pluggable architecture for adding new AI coding tools
- Flexible task definition format

---

## System Workflow

### Main Execution Flow

```
1. PRD Input
   └─> Project Manager Agent analyzes PRD
       └─> Generates project plan with milestones
           └─> Breaks down into tasks with dependencies
               └─> Stores tasks in Task Storage

2. Task Scheduling
   └─> Orchestrator reads tasks from Task Storage
       └─> Applies PERT algorithm to determine execution order
           └─> Identifies tasks with no dependencies (ready to execute)

3. Agent Spawning
   └─> Orchestrator calls Fork Service REST API
       └─> Fork Service creates Git worktree for task
           └─> Fork Service spawns agent (OpenCode/Claude Code/Copilot Code)
               └─> Agent receives task details and context

4. Task Execution
   └─> Agent executes task using CLI tools
       └─> Agent writes progress updates to Context Database
           └─> Watcher Service detects changes via file system events
               └─> Watcher notifies Orchestrator via file writes (push model)

5. Validation
   └─> Orchestrator receives completion notification
       └─> Orchestrator invokes Sprite Test MCP
           └─> Tests execute against agent's work
               ├─> Tests Pass
               │   └─> Orchestrator marks task complete
               │       └─> Task Storage updated
               │           └─> Project Manager reviews deliverable
               │               └─> Project Manager creates Pull Request
               └─> Tests Fail
                   └─> Agent attempts automatic retry
                       ├─> Success: Continue to validation
                       └─> Failure: Write to Context Database
                           └─> Orchestrator spawns new agent (via Fork Service)
                               └─> Retry task execution

6. Human Intervention (When Needed)
   └─> Agent needs permission or has question
       └─> Agent writes question to Task Storage
           └─> Agent marks task as "needs_intervention"
               └─> Human reviews via Watcher API
                   └─> Human provides response in Task Storage
                       └─> Orchestrator detects response
                           └─> Orchestrator completes task with human input

7. Pull Request Review
   └─> Project Manager creates PR for completed tasks
       └─> Human engineer reviews PR
           ├─> Approve: Human merges to main branch
           └─> Reject: Task returns to Task Storage with feedback
```

---

## Communication Architecture

### Agent → Storage Communication
- **Protocol**: REST API
- **Direction**: Agent writes to storage systems
- **Data Flow**: 
  - Agents → Context Database (progress updates, results, errors)
  - Agents → Task Storage (questions, intervention requests)
- **Format**: JSON payloads with session_id for state tracking

### Storage → Golang Program Communication
- **Protocol**: File system events (push model)
- **Direction**: Watcher Service monitors storage changes
- **Data Flow**:
  - Context Database changes → Watcher Service (file write detection)
  - Watcher Service → Orchestrator Agent (file write notifications)
- **Format**: File-based events with metadata

### Human → Golang Program Communication
- **Protocol**: REST API
- **Direction**: Bidirectional
- **Endpoint** : To be defined (e.g., /api/intervention, /api/pr-review)
- **Format**: JSON requests/responses


### Golang Services Internal Communication
- **Fork Service API** (exposed to Orchestrator):
- **Watcher Service API** (exposed to Humans):

- **Endpoint** : To be defined (e.g., /api/intervention, /api/pr-review)

---

## Storage Schemas

### Task Storage Schema
```json
{
  "task_id": "string (UUID)",
  "session_id": "string (UUID)",
  "title": "string",
  "description": "string",
  "dependencies": ["task_id_1", "task_id_2"],
  "status": "pending | in_progress | needs_intervention | completed | failed",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "assigned_agent": "string (agent session_id)",
  "intervention_required": {
    "type": "question | permission",
    "message": "string",
    "human_response": "string | null",
    "responded_at": "timestamp | null"
  },
  "retry_count": "integer",
  "metadata": {
    "milestone": "string",
    "priority": "integer",
    "estimated_effort": "string"
  }
}
```

### Context Database Schema
```json
{
  "agent_id": "string (session_id)",
  "task_id": "string (UUID)",
  "worktree_path": "string",
  "cli_tool": "opencode | claude-code | copilot-code",
  "status": "active | completed | failed | retrying",
  "progress": {
    "current_step": "string",
    "percentage": "integer (0-100)",
    "last_update": "timestamp"
  },
  "output":string (Raw CLI output or agent logs),
  error:boolean,
  "test_results": {
    "last_run": "timestamp",
    "passed": "boolean",
    "details": "string"
  }
}
```

---

## Error Handling & Recovery

### Agent-Level Failures
1. **Automatic Retry**: Agent attempts to retry failed operations internally
2. **Context Logging**: If retry fails, agent writes detailed error to Context Database
3. **Orchestrator Intervention**: Orchestrator detects failure via Watcher notification
4. **New Agent Spawn**: Orchestrator calls Fork Service to create fresh agent instance
5. **Retry Limit**: After multiple spawns fail, mark task as `needs_intervention`

### System-Level Recovery
- All state tracked via persistent storage with session_id
- On system restart, Orchestrator reads Task Storage to identify in-flight tasks
- Tasks in `in_progress` state are re-evaluated (check Context Database for last known state)
- Failed agents are respawned automatically
- Human can manually override any task state via REST API

### Dependency Failures
- When a task fails, Orchestrator marks all dependent tasks as `blocked`
- Blocked tasks remain in queue until dependency is resolved
- Human can break dependency chain via manual intervention
- PERT algorithm recalculates execution order when dependencies change

---

## Human Interaction Points

### 1. Agent Questions/Permissions
- **Trigger**: Agent marks task as `needs_intervention` in Task Storage
- **Notification**: Human monitors Watcher API for intervention requests
- **Response Flow**:
  1. Human retrieves question via The Task Storage API
  2. Human provides answer via The Task storage 
  3. Orchestrator detects response and signals agent to continue
  4. Agent completes task with human-provided guidance

### 2. Pull Request Review
- **Trigger**: Project Manager creates PR after task completion
- **Review Process**: Human engineer reviews code changes in Git
- **Decision Points**:
  - **Approve & Merge**: Code integrated to main branch, task finalized
  - **Request Changes**: Task returned with feedback, agent may re-execute
- **Final Authority**: Human has ultimate decision on code quality and merge

### 3. Manual Overrides
- Human can force-complete or force-fail any task
- Human can modify task dependencies on-the-fly
- Human can restart failed agents or kill runaway processes
- Human can inspect Context Database directly for debugging


---
## System Prompts

[PROJECT-MANAGER-PROMPT](PROJECT-MANAGER-PROMPT.md)
[ORCHESTRATOR-PROMPT](ORCHESTRATOR-PROMPT.md)
[SUB-AGENTS-PROMPT](SUB-AGENTS-PROMPT.md)

## Technology Stack

### AI Coding Tools (CLI-Based)
- **Primary**: OpenCode
- **Future Support**: Claude Code, Copilot Code
- **Interface**: Command-line execution, output parsing

### Golang Services
- **Fork Service**: Worktree management, agent spawning, REST API server
- **Watcher Service**: File system monitoring, event notification, REST API server
- **Frameworks**: Gin/Echo for REST APIs, fsnotify for file watching

### Storage
- **Task Storage**: PostgreSQL / MongoDB (persistent, structured task data)
- **Context Database**: PostgreSQL / MongoDB (persistent, agent state and logs)
- **File System**: Git worktrees, temporary agent workspaces

### Communication
- **REST APIs**: JSON over HTTP for agent-storage and human-system communication
- **File System Events**: Push-based notifications from Watcher to Orchestrator
- **Message Format**: JSON with session_id for state tracking

### Testing
- **Sprite Test MCP**: Automated test execution framework
- **Integration**: REST API or CLI invocation



## Relevant resources/links
[Skills.sh](https://skills.sh/) - Vercel's skills repo.

[AutoMaker](https://github.com/AutoMaker-Org/automaker) - An open-source project for AI driver development using multiple sub agenst might help solving some issues on our end.

[Gitmcp](https://gitmcp.io/) - A tool that converts any repo into an Mcp,


## Question To answer

1) Task Storage Nature (provider?Internal system? File-based? Database?)  =Click Up 
2) Context Database Nature (File based? Database? In-memory?)
3) Define Agents rules and system prompts

