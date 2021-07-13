const W = 400;
const H = 400;
C (
  () => {
    initCenteredCanvas();
    axes();
    console.log(getDrawConfigs())
    text("ABC", 20, 20);
  },
  ".container",
  {
    width: W,
    height: H,
  }
)
