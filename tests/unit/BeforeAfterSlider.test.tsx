import { render, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BeforeAfterSlider } from "../../components/BeforeAfterSlider";

describe("BeforeAfterSlider", () => {
  it("renders with default 50% position", () => {
    const { container } = render(<BeforeAfterSlider before="/a.png" after="/b.png" />);
    // The slider line should be at 50%
    const sliderLine = container.querySelector('div[style*="left: 50%"]');
    expect(sliderLine).toBeInTheDocument();
  });

  it("updates position on mouse interaction", () => {
    const { container } = render(<BeforeAfterSlider before="/a.png" after="/b.png" />);

    // Get the draggable container
    const sliderContainer = container.querySelector('.cursor-ew-resize');
    expect(sliderContainer).toBeInTheDocument();

    if (!sliderContainer) return;

    // Mock getBoundingClientRect
    vi.spyOn(sliderContainer, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 1000,
      height: 500,
      right: 1000,
      bottom: 500,
      x: 0,
      y: 0,
      toJSON: () => {}
    });

    // Simulate drag start at 200px (20%)
    fireEvent.mouseDown(sliderContainer, { clientX: 200 });

    // Check if position updated to 20%
    const sliderLine = container.querySelector('div[style*="left: 20%"]');
    expect(sliderLine).toBeInTheDocument();

    // Clean up
    vi.restoreAllMocks();
  });
});

