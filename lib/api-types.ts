import type {
  CustomerProfile,
  SpendingSummary,
  SpendingByCategory,
  SpendingTrends,
  TransactionResponse,
  SpendingGoalsResponse,
  FiltersResponse,
} from "./types";

export interface paths {
  "/api/customers/{customerId}/profile": {
    get: {
      parameters: {
        path: {
          customerId: string;
        };
      };
      responses: {
        200: {
          content: {
            "application/json": CustomerProfile;
          };
        };
      };
    };
  };
  "/api/customers/{customerId}/spending/summary": {
    get: {
      parameters: {
        path: {
          customerId: string;
        };
        query?: {
          period?: "7d" | "30d" | "90d" | "1y";
        };
      };
      responses: {
        200: {
          content: {
            "application/json": SpendingSummary;
          };
        };
      };
    };
  };
  "/api/customers/{customerId}/spending/categories": {
    get: {
      parameters: {
        path: {
          customerId: string;
        };
        query?: {
          period?: "7d" | "30d" | "90d" | "1y";
          startDate?: string;
          endDate?: string;
        };
      };
      responses: {
        200: {
          content: {
            "application/json": SpendingByCategory;
          };
        };
      };
    };
  };
  "/api/customers/{customerId}/spending/trends": {
    get: {
      parameters: {
        path: {
          customerId: string;
        };
        query?: {
          months?: number;
        };
      };
      responses: {
        200: {
          content: {
            "application/json": SpendingTrends;
          };
        };
      };
    };
  };
  "/api/customers/{customerId}/transactions": {
    get: {
      parameters: {
        path: {
          customerId: string;
        };
        query?: {
          limit?: number;
          offset?: number;
          category?: string;
          startDate?: string;
          endDate?: string;
          minAmount?: number;
          sortBy?: "date_desc" | "date_asc" | "amount_desc" | "amount_asc";
        };
      };
      responses: {
        200: {
          content: {
            "application/json": TransactionResponse;
          };
        };
      };
    };
  };
  "/api/customers/{customerId}/goals": {
    get: {
      parameters: {
        path: {
          customerId: string;
        };
      };
      responses: {
        200: {
          content: {
            "application/json": SpendingGoalsResponse;
          };
        };
      };
    };
  };
  "/api/customers/{customerId}/filters": {
    get: {
      parameters: {
        path: {
          customerId: string;
        };
      };
      responses: {
        200: {
          content: {
            "application/json": FiltersResponse;
          };
        };
      };
    };
  };
}
