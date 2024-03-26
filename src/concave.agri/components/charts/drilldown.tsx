import React, { useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import Highcharts from 'highcharts/highstock';
import drilldown from 'highcharts/modules/drilldown';
import Export from 'highcharts/modules/export-data';
import HighchartsExporting from 'highcharts/modules/exporting';
import showNoData from 'highcharts/modules/no-data-to-display';

HighchartsExporting(Highcharts);
showNoData(Highcharts);
Highcharts3D(Highcharts);
Export(Highcharts);
drilldown(Highcharts);

const DrillDownChart = ({
  type = 'column',
  seriesData = [],
  additionalOptions = {},
}: {
  type: string;
  seriesData?: any;
  additionalOptions?: any;
}) => {
  useEffect(() => {
    HighchartsExporting(Highcharts);
    showNoData(Highcharts);
  }, []);

  const createChartOptions = () => {
    const defaultOptions = {
      chart: {
        type: type,
      },
      title: {
        text: additionalOptions.title || '',
        align: 'left',
      },
      subtitle: {
        text: additionalOptions.subtitle || '',
        align: 'left',
      },
      accessibility: {
        announceNewData: {
          enabled: true,
        },
        point: {
          valueSuffix: '%',
        },
      },
      plotOptions: {
        series: {
          borderRadius: 5,
          dataLabels: [
            {
              enabled: true,
              distance: 15,
              format: '{point.name}',
            },
            {
              enabled: true,
              distance: '-30%',
              filter: {
                property: 'percentage',
                operator: '>',
                value: 5,
              },
              format: '{point.y:.1f}%',
              style: {
                fontSize: '0.9em',
                textOutline: 'none',
              },
            },
          ],
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat:
          additionalOptions?.pointFormat ||
          '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
      },
      series: seriesData,
    };

    return { ...defaultOptions, ...additionalOptions };
  };

  const options = createChartOptions();

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        immutable={true}
      />
    </div>
  );
};

export default DrillDownChart;
