export interface CustomerProfile {
  customerId: string;
  name: string;
  email: string;
  joinDate: string;
  accountType: string;
  totalSpent: number;
  currency: string;
}

export interface SpendingSummary {
  period: string;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  topCategory: string;
  comparedToPrevious: {
    spentChange: number;
    transactionChange: number;
  };
}

export interface CategorySpending {
  name: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  color: string;
  icon: string;
}

export interface SpendingByCategory {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  totalAmount: number;
  categories: CategorySpending[];
}

export interface MonthlyTrend {
  month: string;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
}

export interface SpendingTrends {
  trends: MonthlyTrend[];
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
  icon: string;
  categoryColor: string;
}

export interface TransactionResponse {
  transactions: Transaction[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface TransactionFilters {
  limit?: number;
  offset?: number;
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  sortBy?: "date_desc" | "date_asc" | "amount_desc" | "amount_asc";
}

export interface SpendingGoal {
  id: string;
  category: string;
  monthlyBudget: number;
  currentSpent: number;
  percentageUsed: number;
  daysRemaining: number;
  status: "on_track" | "warning" | "exceeded";
}

export interface SpendingGoalsResponse {
  goals: SpendingGoal[];
}

export interface CategoryFilter {
  name: string;
  color: string;
  icon: string;
}

export interface DateRangePreset {
  label: string;
  value: string;
}

export interface FiltersResponse {
  categories: CategoryFilter[];
  dateRangePresets: DateRangePreset[];
}
