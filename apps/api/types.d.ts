declare namespace Express {
  interface Request {
    userId?: string;
  }
}
interface Website {
  id: string;
  url: string;
  userId: string;
  latencyAlert: number;

  ticks?: Ticks[];
  disabled: boolean;
}
interface Ticks {
  id: number;
  websiteId: number;
  validatorId: string;
  status: "GOOD" | "BAD";
  latency: number;
  createdAt: Date;
}
interface Validator {
  id: string;
  publicKey: string;
  location: string;
  ip: string;
  pendingPayouts: number;
  ticks?: Ticks[];
  history: Transaction[];
}

interface Transaction {
  amount: number;
  signature: string;
  timestamp: Date;
}
