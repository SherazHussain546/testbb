export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  constructor(public context: SecurityRuleContext) {
    const contextString = JSON.stringify(context, null, 2);
    super(
      `Firestore operation failed. The following request was denied by security rules:\n${contextString}`
    );
    this.name = 'FirestorePermissionError';
  }
}
