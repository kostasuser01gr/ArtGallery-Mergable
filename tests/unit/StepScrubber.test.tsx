import { fireEvent, render, screen } from "@testing-library/react";
import { StepScrubber } from "@/components/StepScrubber";

const steps = [
  {
    id: "one",
    label: "One",
    timestamp: "00:00",
    promptText: "",
    settingsJSON: {},
    preview: "/one.png",
  },
  {
    id: "two",
    label: "Two",
    timestamp: "00:10",
    promptText: "",
    settingsJSON: {},
    preview: "/two.png",
  },
];

describe("StepScrubber", () => {
  it("calls onSelect when clicked", () => {
    const onSelect = vi.fn();
    render(<StepScrubber steps={steps} activeStepId="one" onSelect={onSelect} />);

    fireEvent.click(screen.getByLabelText("Go to Two"));

    expect(onSelect).toHaveBeenCalledWith("two");
  });
});
