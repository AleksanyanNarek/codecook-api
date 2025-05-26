import { TokenPayload } from "../../utils/types";

declare global {
  namespace Express {
    interface Request {
      tokenUser?: TokenPayload;
    }
  }
}