import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highcharts-gantt';

const GanttChart = ({
  title,
  uniqueNames = true,
  descriptionFormat,
  xAxisDescriptionPlural,
  series,
}: {
  title?: string;
  uniqueNames?: boolean;
  descriptionFormat?: string;
  xAxisDescriptionPlural?: string;
  series?: any;
}) => {
  const options = {
    title: {
      text: title,
    },
    yAxis: {
      uniqueNames: uniqueNames,
    },
    accessibility: {
      point: {
        descriptionFormat:
          descriptionFormat ||
          '{yCategory}. ' +
            '{#if completed}Task {(multiply completed.amount 100):.1f}% completed. {/if}' +
            'Start {x:%Y-%m-%d}, end {x2:%Y-%m-%d}.',
      },
    },
    lang: {
      accessibility: {
        axis: {
          xAxisDescriptionPlural:
            xAxisDescriptionPlural ||
            'The chart has a two-part X axis showing time in both week numbers and days.',
        },
      },
    },
    series: series || [],
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={'ganttChart'}
      options={options}
      immutable={true}
    />
  );
};

export default GanttChart;
