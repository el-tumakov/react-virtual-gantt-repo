import dayjs from "dayjs";
import { Gantt } from "react-virtual-gantt";
import { getRandomGanttData } from "../utils/getRandomGanttDate";

const mockData = getRandomGanttData(
  100,
  dayjs().subtract(7, "days").toDate(),
  dayjs().add(7, "days").toDate()
);

console.log({ mockData });

export default function Home() {
  return (
    <main style={{ padding: "16px" }}>
      <Gantt>
        <Gantt.Controls />
        <Gantt.Chart data={mockData} />
      </Gantt>
    </main>
  );
}
