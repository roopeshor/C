const W = 400;
const H = 400;
C (
  () => {
    initCenteredCanvas();
    axes();
    text("")
  },
  ".container",
  {
    width: W,
    height: H,
  }
)