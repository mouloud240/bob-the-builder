import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { OpencodeAdapterService } from './opencode-adapter.service';
import { AGENT_PROVIDER } from '@ai-orchestrator/core-interfaces';

describe('OpencodeAdapterService', () => {
  let service: OpencodeAdapterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env', '.env.local'],
        }),
      ],
      providers: [
        OpencodeAdapterService,
        {
          provide: AGENT_PROVIDER,
          useExisting: OpencodeAdapterService,
        },
      ],
    }).compile();

    service = module.get<OpencodeAdapterService>(OpencodeAdapterService);
  });

  describe('connection', () => {
    it('should have isConnected method', () => {
      expect(typeof service.isConnected).toBe('function');
    });

    it('should have getConnectionError method', () => {
      expect(typeof service.getConnectionError).toBe('function');
    });

    it('should have reconnect method', () => {
      expect(typeof service.reconnect).toBe('function');
    });

    it('should report not connected before initialization', () => {
      expect(service.isConnected()).toBe(false);
    });

    it('should have null connection error before initialization attempt', () => {
      expect(service.getConnectionError()).toBeNull();
    });
  });

  describe('interface compliance', () => {
    it('should implement IAgentProvider methods', () => {
      expect(typeof service.createSession).toBe('function');
      expect(typeof service.sendPrompt).toBe('function');
      expect(typeof service.getSession).toBe('function');
      expect(typeof service.getSessionStatus).toBe('function');
      expect(typeof service.listSessions).toBe('function');
      expect(typeof service.abortSession).toBe('function');
      expect(typeof service.getDiff).toBe('function');
      expect(typeof service.grantPermission).toBe('function');
      expect(typeof service.onSessionEvent).toBe('function');
    });
  });

  describe('when OpenCode server is not available', () => {
    it('should throw when calling createSession without connection', async () => {
      await expect(service.createSession({ taskId: '123', prompt: 'test' }))
        .rejects.toThrow('OpenCode client is not connected');
    });

    it('should throw when calling sendPrompt without connection', async () => {
      await expect(service.sendPrompt('123', 'test'))
        .rejects.toThrow('OpenCode client is not connected');
    });

    it('should throw when calling getSession without connection', async () => {
      await expect(service.getSession('123'))
        .rejects.toThrow('OpenCode client is not connected');
    });

    it('should throw when calling getDiff without connection', async () => {
      await expect(service.getDiff('123'))
        .rejects.toThrow('OpenCode client is not connected');
    });

    it('should throw when calling abortSession without connection', async () => {
      await expect(service.abortSession('123'))
        .rejects.toThrow('OpenCode client is not connected');
    });

    it('should throw when calling grantPermission without connection', async () => {
      await expect(service.grantPermission('123', 'perm-1', 'once'))
        .rejects.toThrow('OpenCode client is not connected');
    });

    it('should throw when calling listSessions without connection', async () => {
      await expect(service.listSessions())
        .rejects.toThrow('OpenCode client is not connected');
    });
  });
});