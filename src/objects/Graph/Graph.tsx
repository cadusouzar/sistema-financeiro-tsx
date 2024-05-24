import { Chart } from "react-google-charts";

type GraphProps = {
  data: Array<Array<any>>;
  options: object;
  width?: string
  height?: string
};

export const Graph: React.FC<GraphProps> = ({ data, options, width = '100%', height = '260px' }) => {
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={width}
      height={height}
    />
  );
};