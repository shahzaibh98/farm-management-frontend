import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import Highcharts from 'highcharts/highstock';
import drilldown from 'highcharts/modules/drilldown';
import Export from 'highcharts/modules/export-data';
import HighchartsExporting from 'highcharts/modules/exporting';
import showNoData from 'highcharts/modules/no-data-to-display';
import { useEffect } from 'react';

const ThreeDChart = ({
  chartType = 'column',
  seriesData = [],
  additionalOptions = {},
}: {
  chartType?: string;
  seriesData?: any;
  additionalOptions?: any;
}) => {
  useEffect(() => {
    HighchartsExporting(Highcharts);
    showNoData(Highcharts);
    HighchartsExporting(Highcharts);
    Highcharts3D(Highcharts);
    Export(Highcharts);
    drilldown(Highcharts);
  }, []);

  const createChartOptions = () => {
    const defaultOptions = {
      chart: {
        type: chartType,
        options3d: {
          enabled: true,
          alpha: 15,
          beta: 15,
          depth: chartType === 'column' ? 50 : 40,
          viewDistance: 25,
        },
      },
      title: {
        text: additionalOptions.title || '',
        align: 'left',
      },
      subtitle: {
        text: additionalOptions.subtitle || '',
        align: 'left',
      },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: additionalOptions.pointFormat || '',
      },
      plotOptions: {
        column: {
          depth: 25,
        },
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

export default ThreeDChart;
