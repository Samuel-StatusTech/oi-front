import { format } from 'currency-formatter'
import { formatDate } from "../../../utils/date"

export const getGraphData = (history = []) => {

  return {
    series: [{
      name: "Vendido",
      data: history
    }],
    options: {
      chart: {
        type: 'area',
        height: "100%",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      markers: {
        enabled: false,
        size: 0,
        style: 'hollow',
      },
      xaxis: {
        axisTicks: {
          show: false
        },
        tootip: {
          show: false,
          enabled: false,
        },
        labels: {
          formatter: (d) => {
            return formatDate(d)
          }
        },
        // categories: history.map(d => formatDate(d.x, false, true)),
        // type: 'datetime',
      },
      tootip: {
        show: false
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
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      },
    }
  }
}

/*

var resetCssClasses = function (activeEl) {
  var els = document.querySelectorAll('button')
  Array.prototype.forEach.call(els, function (el) {
    el.classList.remove('active')
  })

  activeEl.target.classList.add('active')
}

document
  .querySelector('#one_month')
  .addEventListener('click', function (e) {
    resetCssClasses(e)

    chart.zoomX(
      new Date('28 Jan 2013').getTime(),
      new Date('27 Feb 2013').getTime()
    )
  })

document
  .querySelector('#six_months')
  .addEventListener('click', function (e) {
    resetCssClasses(e)

    chart.zoomX(
      new Date('27 Sep 2012').getTime(),
      new Date('27 Feb 2013').getTime()
    )
  })

document
  .querySelector('#one_year')
  .addEventListener('click', function (e) {
    resetCssClasses(e)
    chart.zoomX(
      new Date('27 Feb 2012').getTime(),
      new Date('27 Feb 2013').getTime()
    )
  })

document.querySelector('#ytd').addEventListener('click', function (e) {
  resetCssClasses(e)

  chart.zoomX(
    new Date('01 Jan 2013').getTime(),
    new Date('27 Feb 2013').getTime()
  )
})

document.querySelector('#all').addEventListener('click', function (e) {
  resetCssClasses(e)

  chart.zoomX(
    new Date('23 Jan 2012').getTime(),
    new Date('27 Feb 2013').getTime()
  )
})

*/