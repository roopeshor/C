const W = 400;
const H = 400;

function fact (x) {
  if (x > 1) {
    return x * fact(x - 1);
  } else {
    return 1;
  }
}

C (
  () => {
    initCenteredCanvas();
    loop(()=>{
      axes();
      background(0);
      numberPlane();
      text(getFPS().toFixed(3));
    },"c", 0);
  },
  ".container",
  {
    name: "c",
    width: W,
    height: H,
  }
)
