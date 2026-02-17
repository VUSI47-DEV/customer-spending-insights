import type {
  CustomerProfile,
  SpendingSummary,
  SpendingByCategory,
  SpendingTrends,
  Transaction,
  TransactionResponse,
  TransactionFilters,
  SpendingGoalsResponse,
  FiltersResponse,
} from "./types";

export function getCustomerProfile(): CustomerProfile {
  return {
    customerId: "12345",
    name: "John Doe",
    email: "john.doe@email.com",
    joinDate: "2023-01-15",
    accountType: "premium",
    totalSpent: 15420.5,
    currency: "ZAR",
  };
}

const summaryByPeriod: Record<string, SpendingSummary> = {
  "7d": {
    period: "7d",
    totalSpent: 1120.35,
    transactionCount: 12,
    averageTransaction: 93.36,
    topCategory: "Groceries",
    comparedToPrevious: { spentChange: 5.2, transactionChange: -1.8 },
  },
  "30d": {
    period: "30d",
    totalSpent: 4250.75,
    transactionCount: 47,
    averageTransaction: 90.44,
    topCategory: "Groceries",
    comparedToPrevious: { spentChange: 12.5, transactionChange: -3.2 },
  },
  "90d": {
    period: "90d",
    totalSpent: 11850.2,
    transactionCount: 132,
    averageTransaction: 89.77,
    topCategory: "Groceries",
    comparedToPrevious: { spentChange: -2.1, transactionChange: 4.5 },
  },
  "1y": {
    period: "1y",
    totalSpent: 15420.5,
    transactionCount: 487,
    averageTransaction: 31.66,
    topCategory: "Groceries",
    comparedToPrevious: { spentChange: 8.3, transactionChange: 12.0 },
  },
};

export function getSpendingSummary(period: string = "30d"): SpendingSummary {
  return summaryByPeriod[period] || summaryByPeriod["30d"];
}

const categoriesByPeriod: Record<string, SpendingByCategory> = {
  "7d": {
    dateRange: { startDate: "2024-09-09", endDate: "2024-09-16" },
    totalAmount: 1120.35,
    categories: [
      { name: "Groceries", amount: 380.2, percentage: 33.9, transactionCount: 4, color: "#FF6B6B", icon: "shopping-cart" },
      { name: "Entertainment", amount: 199.0, percentage: 17.8, transactionCount: 2, color: "#4ECDC4", icon: "film" },
      { name: "Transportation", amount: 210.15, percentage: 18.8, transactionCount: 3, color: "#45B7D1", icon: "car" },
      { name: "Dining", amount: 165.0, percentage: 14.7, transactionCount: 2, color: "#F7DC6F", icon: "utensils" },
      { name: "Shopping", amount: 89.0, percentage: 7.9, transactionCount: 1, color: "#BB8FCE", icon: "shopping-bag" },
      { name: "Utilities", amount: 77.0, percentage: 6.9, transactionCount: 0, color: "#85C1E9", icon: "zap" },
    ],
  },
  "30d": {
    dateRange: { startDate: "2024-08-16", endDate: "2024-09-16" },
    totalAmount: 4250.75,
    categories: [
      { name: "Groceries", amount: 1250.3, percentage: 29.4, transactionCount: 15, color: "#FF6B6B", icon: "shopping-cart" },
      { name: "Entertainment", amount: 890.2, percentage: 20.9, transactionCount: 8, color: "#4ECDC4", icon: "film" },
      { name: "Transportation", amount: 680.45, percentage: 16.0, transactionCount: 12, color: "#45B7D1", icon: "car" },
      { name: "Dining", amount: 520.3, percentage: 12.2, transactionCount: 9, color: "#F7DC6F", icon: "utensils" },
      { name: "Shopping", amount: 450.8, percentage: 10.6, transactionCount: 6, color: "#BB8FCE", icon: "shopping-bag" },
      { name: "Utilities", amount: 458.7, percentage: 10.8, transactionCount: 3, color: "#85C1E9", icon: "zap" },
    ],
  },
  "90d": {
    dateRange: { startDate: "2024-06-16", endDate: "2024-09-16" },
    totalAmount: 11850.2,
    categories: [
      { name: "Groceries", amount: 3650.1, percentage: 30.8, transactionCount: 42, color: "#FF6B6B", icon: "shopping-cart" },
      { name: "Entertainment", amount: 2380.5, percentage: 20.1, transactionCount: 22, color: "#4ECDC4", icon: "film" },
      { name: "Transportation", amount: 1890.3, percentage: 16.0, transactionCount: 31, color: "#45B7D1", icon: "car" },
      { name: "Dining", amount: 1520.0, percentage: 12.8, transactionCount: 25, color: "#F7DC6F", icon: "utensils" },
      { name: "Shopping", amount: 1250.6, percentage: 10.6, transactionCount: 15, color: "#BB8FCE", icon: "shopping-bag" },
      { name: "Utilities", amount: 1158.7, percentage: 9.8, transactionCount: 9, color: "#85C1E9", icon: "zap" },
    ],
  },
  "1y": {
    dateRange: { startDate: "2023-09-16", endDate: "2024-09-16" },
    totalAmount: 15420.5,
    categories: [
      { name: "Groceries", amount: 4750.3, percentage: 30.8, transactionCount: 156, color: "#FF6B6B", icon: "shopping-cart" },
      { name: "Entertainment", amount: 3120.4, percentage: 20.2, transactionCount: 87, color: "#4ECDC4", icon: "film" },
      { name: "Transportation", amount: 2460.2, percentage: 16.0, transactionCount: 102, color: "#45B7D1", icon: "car" },
      { name: "Dining", amount: 1980.5, percentage: 12.8, transactionCount: 78, color: "#F7DC6F", icon: "utensils" },
      { name: "Shopping", amount: 1650.8, percentage: 10.7, transactionCount: 42, color: "#BB8FCE", icon: "shopping-bag" },
      { name: "Utilities", amount: 1458.3, percentage: 9.5, transactionCount: 36, color: "#85C1E9", icon: "zap" },
    ],
  },
};

export function getSpendingByCategory(period: string = "30d"): SpendingByCategory {
  return categoriesByPeriod[period] || categoriesByPeriod["30d"];
}

export function getSpendingTrends(): SpendingTrends {
  return {
    trends: [
      { month: "2024-01", totalSpent: 3890.25, transactionCount: 42, averageTransaction: 92.62 },
      { month: "2024-02", totalSpent: 4150.8, transactionCount: 38, averageTransaction: 109.23 },
      { month: "2024-03", totalSpent: 3750.6, transactionCount: 45, averageTransaction: 83.35 },
      { month: "2024-04", totalSpent: 4200.45, transactionCount: 39, averageTransaction: 107.7 },
      { month: "2024-05", totalSpent: 3980.3, transactionCount: 44, averageTransaction: 90.46 },
      { month: "2024-06", totalSpent: 4250.75, transactionCount: 47, averageTransaction: 90.44 },
      { month: "2024-07", totalSpent: 3620.9, transactionCount: 41, averageTransaction: 88.31 },
      { month: "2024-08", totalSpent: 4480.15, transactionCount: 50, averageTransaction: 89.6 },
      { month: "2024-09", totalSpent: 4120.55, transactionCount: 46, averageTransaction: 89.58 },
      { month: "2024-10", totalSpent: 3950.8, transactionCount: 43, averageTransaction: 91.88 },
      { month: "2024-11", totalSpent: 4650.35, transactionCount: 52, averageTransaction: 89.43 },
      { month: "2024-12", totalSpent: 5120.6, transactionCount: 58, averageTransaction: 88.29 },
    ],
  };
}

const allTransactions: Transaction[] = [
  { id: "txn_001", date: "2024-09-16T14:30:00Z", merchant: "Pick n Pay", category: "Groceries", amount: 245.8, description: "Weekly groceries", paymentMethod: "Credit Card", icon: "shopping-cart", categoryColor: "#FF6B6B" },
  { id: "txn_002", date: "2024-09-15T10:15:00Z", merchant: "Netflix", category: "Entertainment", amount: 199.0, description: "Monthly subscription", paymentMethod: "Debit Order", icon: "film", categoryColor: "#4ECDC4" },
  { id: "txn_003", date: "2024-09-14T08:45:00Z", merchant: "Uber", category: "Transportation", amount: 85.5, description: "Ride to office", paymentMethod: "Credit Card", icon: "car", categoryColor: "#45B7D1" },
  { id: "txn_004", date: "2024-09-13T19:20:00Z", merchant: "Nando's", category: "Dining", amount: 165.0, description: "Dinner with friends", paymentMethod: "Credit Card", icon: "utensils", categoryColor: "#F7DC6F" },
  { id: "txn_005", date: "2024-09-12T11:00:00Z", merchant: "Woolworths", category: "Groceries", amount: 320.45, description: "Organic produce", paymentMethod: "Debit Card", icon: "shopping-cart", categoryColor: "#FF6B6B" },
  { id: "txn_006", date: "2024-09-11T16:30:00Z", merchant: "City Power", category: "Utilities", amount: 458.7, description: "Electricity prepaid", paymentMethod: "EFT", icon: "zap", categoryColor: "#85C1E9" },
  { id: "txn_007", date: "2024-09-10T09:15:00Z", merchant: "Engen", category: "Transportation", amount: 450.0, description: "Fuel", paymentMethod: "Credit Card", icon: "car", categoryColor: "#45B7D1" },
  { id: "txn_008", date: "2024-09-09T13:00:00Z", merchant: "Takealot", category: "Shopping", amount: 289.9, description: "Bluetooth headphones", paymentMethod: "Credit Card", icon: "shopping-bag", categoryColor: "#BB8FCE" },
  { id: "txn_009", date: "2024-09-08T20:00:00Z", merchant: "Ster-Kinekor", category: "Entertainment", amount: 180.0, description: "Movie tickets x2", paymentMethod: "Credit Card", icon: "film", categoryColor: "#4ECDC4" },
  { id: "txn_010", date: "2024-09-07T12:30:00Z", merchant: "Checkers", category: "Groceries", amount: 198.35, description: "Lunch supplies", paymentMethod: "Debit Card", icon: "shopping-cart", categoryColor: "#FF6B6B" },
  { id: "txn_011", date: "2024-09-06T07:45:00Z", merchant: "Bolt", category: "Transportation", amount: 62.0, description: "Morning commute", paymentMethod: "Credit Card", icon: "car", categoryColor: "#45B7D1" },
  { id: "txn_012", date: "2024-09-05T18:15:00Z", merchant: "Ocean Basket", category: "Dining", amount: 210.5, description: "Seafood dinner", paymentMethod: "Credit Card", icon: "utensils", categoryColor: "#F7DC6F" },
  { id: "txn_013", date: "2024-09-04T10:00:00Z", merchant: "Spotify", category: "Entertainment", amount: 79.99, description: "Premium subscription", paymentMethod: "Debit Order", icon: "film", categoryColor: "#4ECDC4" },
  { id: "txn_014", date: "2024-09-03T14:20:00Z", merchant: "Mr Price", category: "Shopping", amount: 160.9, description: "New t-shirts", paymentMethod: "Credit Card", icon: "shopping-bag", categoryColor: "#BB8FCE" },
  { id: "txn_015", date: "2024-09-02T09:00:00Z", merchant: "Uber", category: "Transportation", amount: 95.0, description: "Airport transfer", paymentMethod: "Credit Card", icon: "car", categoryColor: "#45B7D1" },
  { id: "txn_016", date: "2024-09-01T15:30:00Z", merchant: "Spar", category: "Groceries", amount: 175.6, description: "Quick shop", paymentMethod: "Debit Card", icon: "shopping-cart", categoryColor: "#FF6B6B" },
  { id: "txn_017", date: "2024-08-31T11:45:00Z", merchant: "Mugg & Bean", category: "Dining", amount: 89.0, description: "Coffee and pastry", paymentMethod: "Credit Card", icon: "utensils", categoryColor: "#F7DC6F" },
  { id: "txn_018", date: "2024-08-30T17:00:00Z", merchant: "DStv", category: "Entertainment", amount: 349.0, description: "Monthly subscription", paymentMethod: "Debit Order", icon: "film", categoryColor: "#4ECDC4" },
  { id: "txn_019", date: "2024-08-29T08:30:00Z", merchant: "Gautrain", category: "Transportation", amount: 88.0, description: "Return trip", paymentMethod: "Travel Card", icon: "car", categoryColor: "#45B7D1" },
  { id: "txn_020", date: "2024-08-28T13:15:00Z", merchant: "Pick n Pay", category: "Groceries", amount: 410.2, description: "Monthly groceries", paymentMethod: "Credit Card", icon: "shopping-cart", categoryColor: "#FF6B6B" },
  { id: "txn_021", date: "2024-08-27T19:45:00Z", merchant: "Vida e Caffè", category: "Dining", amount: 55.8, description: "Coffee to go", paymentMethod: "Debit Card", icon: "utensils", categoryColor: "#F7DC6F" },
  { id: "txn_022", date: "2024-08-26T10:30:00Z", merchant: "Cotton On", category: "Shopping", amount: 320.0, description: "Winter jackets", paymentMethod: "Credit Card", icon: "shopping-bag", categoryColor: "#BB8FCE" },
  { id: "txn_023", date: "2024-08-25T16:00:00Z", merchant: "Showmax", category: "Entertainment", amount: 99.0, description: "Streaming subscription", paymentMethod: "Debit Order", icon: "film", categoryColor: "#4ECDC4" },
  { id: "txn_024", date: "2024-08-24T07:15:00Z", merchant: "Shell", category: "Transportation", amount: 380.0, description: "Fuel top-up", paymentMethod: "Credit Card", icon: "car", categoryColor: "#45B7D1" },
  { id: "txn_025", date: "2024-08-23T12:00:00Z", merchant: "Woolworths", category: "Groceries", amount: 265.9, description: "Ready meals", paymentMethod: "Credit Card", icon: "shopping-cart", categoryColor: "#FF6B6B" },
  { id: "txn_026", date: "2024-08-22T18:30:00Z", merchant: "Col'Cacchio", category: "Dining", amount: 195.0, description: "Pizza night", paymentMethod: "Credit Card", icon: "utensils", categoryColor: "#F7DC6F" },
  { id: "txn_027", date: "2024-08-21T09:45:00Z", merchant: "Uber", category: "Transportation", amount: 72.0, description: "Short trip", paymentMethod: "Credit Card", icon: "car", categoryColor: "#45B7D1" },
  { id: "txn_028", date: "2024-08-20T14:00:00Z", merchant: "Game", category: "Shopping", amount: 599.0, description: "Desk lamp", paymentMethod: "Credit Card", icon: "shopping-bag", categoryColor: "#BB8FCE" },
  { id: "txn_029", date: "2024-08-19T11:30:00Z", merchant: "Checkers", category: "Groceries", amount: 145.8, description: "Snacks and drinks", paymentMethod: "Debit Card", icon: "shopping-cart", categoryColor: "#FF6B6B" },
  { id: "txn_030", date: "2024-08-18T20:15:00Z", merchant: "iStore", category: "Shopping", amount: 1299.0, description: "AirPods case", paymentMethod: "Credit Card", icon: "shopping-bag", categoryColor: "#BB8FCE" },
];

export function getTransactions(filters: TransactionFilters = {}): TransactionResponse {
  const { limit = 20, offset = 0, category, startDate, endDate, minAmount, sortBy = "date_desc" } = filters;

  let filtered = [...allTransactions];

  if (category) {
    filtered = filtered.filter((t) => t.category === category);
  }
  if (startDate) {
    filtered = filtered.filter((t) => t.date >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter((t) => t.date <= endDate);
  }
  if (minAmount !== undefined) {
    filtered = filtered.filter((t) => t.amount >= minAmount);
  }

  switch (sortBy) {
    case "date_asc":
      filtered.sort((a, b) => a.date.localeCompare(b.date));
      break;
    case "date_desc":
      filtered.sort((a, b) => b.date.localeCompare(a.date));
      break;
    case "amount_asc":
      filtered.sort((a, b) => a.amount - b.amount);
      break;
    case "amount_desc":
      filtered.sort((a, b) => b.amount - a.amount);
      break;
  }

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    transactions: paginated,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  };
}

export function getSpendingGoals(): SpendingGoalsResponse {
  return {
    goals: [
      {
        id: "goal_001",
        category: "Entertainment",
        monthlyBudget: 1000.0,
        currentSpent: 650.3,
        percentageUsed: 65.03,
        daysRemaining: 12,
        status: "on_track",
      },
      {
        id: "goal_002",
        category: "Groceries",
        monthlyBudget: 1500.0,
        currentSpent: 1450.8,
        percentageUsed: 96.72,
        daysRemaining: 12,
        status: "warning",
      },
      {
        id: "goal_003",
        category: "Dining",
        monthlyBudget: 600.0,
        currentSpent: 685.3,
        percentageUsed: 114.22,
        daysRemaining: 12,
        status: "exceeded",
      },
      {
        id: "goal_004",
        category: "Transportation",
        monthlyBudget: 800.0,
        currentSpent: 420.5,
        percentageUsed: 52.56,
        daysRemaining: 12,
        status: "on_track",
      },
    ],
  };
}

export function getFilters(): FiltersResponse {
  return {
    categories: [
      { name: "Groceries", color: "#FF6B6B", icon: "shopping-cart" },
      { name: "Entertainment", color: "#4ECDC4", icon: "film" },
      { name: "Transportation", color: "#45B7D1", icon: "car" },
      { name: "Dining", color: "#F7DC6F", icon: "utensils" },
      { name: "Shopping", color: "#BB8FCE", icon: "shopping-bag" },
      { name: "Utilities", color: "#85C1E9", icon: "zap" },
    ],
    dateRangePresets: [
      { label: "Last 7 days", value: "7d" },
      { label: "Last 30 days", value: "30d" },
      { label: "Last 90 days", value: "90d" },
      { label: "Last year", value: "1y" },
    ],
  };
}
