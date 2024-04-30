import { format } from "currency-formatter"

export const getGraphData = (series, labels) => {

  return {
    series: series,
    options: {
      chart: {
        width: 380,
        type: 'pie',
        height: "100%",
      },
      yaxis: {
        axisTicks: {
          show: false
        },
        labels: {
          formatter: (d) => {
            return format(d / 100, { code: "BRL" })
          }
        },
      },
      legend: {
        position: "right",
      },
      colors: ['#31BCDC', '#FF9774', '#2FD8A0', '#54789D', '#213344'],
      labels: labels,
    },
  }
}
