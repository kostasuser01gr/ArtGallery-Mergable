import { fireEvent, render, screen } from "@testing-library/react";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

describe("BeforeAfterSlider", () => {
  it("updates slider value", () => {
    render(<BeforeAfterSlider before="/a.png" after="/b.png" />);
    const slider = screen.getByLabelText("Before and after slider") as HTMLInputElement;

    fireEvent.change(slider, { target: { value: "80" } });

    expect(slider.value).toBe("80");
  });
});
