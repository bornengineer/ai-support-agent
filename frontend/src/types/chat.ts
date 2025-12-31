export type Msg = {
  id?: number;
  sender: "user" | "ai";
  text: string;
  created_at?: string;
};
