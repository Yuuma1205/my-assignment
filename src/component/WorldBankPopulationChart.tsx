import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import type { PopulationDataItem, ChartData } from "../types/worldBank";

const WorldBankPopulationChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPopulationData() {
      try {
        setLoading(true);
        setError(null);

        const countryCode = "CHN";
        const startDate = 2014;
        const endDate = 2024;

        // 獲取城鎮人口數據
        const urbanRes = await fetch(
          `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.URB.TOTL?format=json&date=${startDate}:${endDate}&per_page=100`
        );
        // 獲取鄉村人口數據
        const ruralRes = await fetch(
          `https://api.worldbank.org/v2/country/${countryCode}/indicator/SP.RUR.TOTL?format=json&date=${startDate}:${endDate}&per_page=100`
        );

        if (!urbanRes.ok || !ruralRes.ok) {
          throw new Error(
            `HTTP error! Urban status: ${urbanRes.status}, Rural status: ${ruralRes.status}`
          );
        }

        const urbanJson = await urbanRes.json();
        const ruralJson = await ruralRes.json();

        // World Bank API 的數據結構是 [page_info, data_array]
        const urbanData: PopulationDataItem[] = urbanJson[1];
        const ruralData: PopulationDataItem[] = ruralJson[1];

        if (
          !Array.isArray(urbanData) ||
          urbanData.length === 0 ||
          !Array.isArray(ruralData) ||
          ruralData.length === 0
        ) {
          setError("API 沒有返回數據，請檢查國家代碼或日期範圍。");
          setLoading(false);
          return;
        }

        //數據轉換和合併
        const combinedData: Record<string, ChartData> = {}; // 用於按年份合併數據

        // 處理城鎮人口數據
        urbanData.forEach((item) => {
          if (item.date && item.value !== null) {
            // 確保年份和值存在
            if (!combinedData[item.date]) {
              combinedData[item.date] = { year: item.date, urban: 0, rural: 0 };
            }
            combinedData[item.date].urban = parseFloat(
              (item.value / 1000000).toFixed(2)
            ); // 轉換為百萬人
          }
        });

        // 處理鄉村人口數據
        ruralData.forEach((item) => {
          if (item.date && item.value !== null) {
            // 確保年份和值存在
            if (!combinedData[item.date]) {
              combinedData[item.date] = { year: item.date, urban: 0, rural: 0 };
            }
            combinedData[item.date].rural = parseFloat(
              (item.value / 1000000).toFixed(2)
            ); // 轉換為百萬人
          }
        });

        // 將合併後的數據轉換為陣列並按年份排序
        const finalData = Object.values(combinedData)
          .sort((a, b) => parseInt(a.year) - parseInt(b.year))
          .filter((d) => d.urban > 0 || d.rural > 0); // 過濾掉沒有有效數據的年份

        setData(finalData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          `無法載入數據：${err instanceof Error ? err.message : String(err)}`
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPopulationData();
  }, []); // 空依賴陣列表示只在組件掛載時運行一次

  return (
    <div style={{ width: "100%", height: 420 }}>
      <h2 style={{ textAlign: "center" }}>
        {`中國歷年城鎮與鄉村人口 (單位: 百萬人)`}
      </h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>正在載入人口數據...</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="95%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, bottom: 20, left: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" /> {/* 網格線 */}
            <XAxis dataKey="year" />
            <YAxis
              label={{
                value: "人口 (百萬)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip /> {/* 滑鼠懸停時顯示數據詳情 */}
            <Legend /> {/* 圖例，顯示每個數據系列的名稱和顏色 */}
            {/* 重疊柱狀圖：將多個 Bar 組件放置在同一個 Chart 中，並給予相同的 stackId */}
            <Bar
              dataKey="urban"
              stackId="population"
              fill="#8884d8"
              name="城鎮人口"
            />
            <Bar
              dataKey="rural"
              stackId="population"
              fill="#82ca9d"
              name="鄉村人口"
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ textAlign: "center" }}>沒有可顯示的人口數據。</p>
      )}
    </div>
  );
};

export default WorldBankPopulationChart;
