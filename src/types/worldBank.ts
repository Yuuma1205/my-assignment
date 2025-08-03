// World Bank API 單筆資料型別
export interface PopulationDataItem {
  date: string; // 年份
  value: number | null; // 人口數
}

// Chart 顯示用型別
export interface ChartData {
  year: string;
  urban: number;
  rural: number;
}
