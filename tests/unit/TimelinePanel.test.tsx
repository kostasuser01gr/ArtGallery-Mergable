import { fireEvent, render, screen } from "@testing-library/react";
import { TimelinePanel } from "@/components/TimelinePanel";

const steps = [
  {
    id: "a",
    label: "A",
    timestamp: "00:00",
    promptText: "",
    settingsJSON: {},
    preview: "/a.png",
  },
  {
    id: "b",
    label: "B",
    timestamp: "00:10",
    promptText: "",
    settingsJSON: {},
    preview: "/b.png",
  },
];

describe("TimelinePanel", () => {
  it("renders steps and selection", () => {
    const onSelect = vi.fn();
    render(<TimelinePanel steps={steps} activeStepId="a" onSelect={onSelect} />);

    fireEvent.click(screen.getByText("B"));

    expect(onSelect).toHaveBeenCalledWith("b");
  });
});
