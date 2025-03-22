interface Website {
  id: string;
  url: string;
  ticks: WebsiteTick[];
  lastValidator?: Validator | null;
  recentTicks: WebsiteTick[];
}

interface WebsiteTick {
  id: string;
  createdAt: string;
  status: "GOOD" | "BAD";
  latency: number;
  validator: Validator;
}
