export const createOpencodeClient = jest.fn().mockReturnValue({
  session: {
    create: jest.fn(),
    get: jest.fn(),
    list: jest.fn(),
    promptAsync: jest.fn(),
    abort: jest.fn(),
    diff: jest.fn(),
    status: jest.fn(),
  },
  event: {
    subscribe: jest.fn(),
  },
  postSessionIdPermissionsPermissionId: jest.fn(),
});