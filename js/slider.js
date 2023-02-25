const track = document.getElementById("image-track");

let linkUnderCursor = null;
let linkMouseDown = null;

const handleOnDown = e => {
  track.dataset.mouseDownAt = e.clientX;
  const link = e.target.closest('a');
  if (link) {
    linkUnderCursor = link;
  }
}

const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
  linkMouseDown.style.pointerEvents = "auto";
};

const handleOnMove = e => {
  if(track.dataset.mouseDownAt === "0") return;
  
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;
  
  const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -40); /*Values for 5 projects*/
        /*nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -66); /*Values for 9 projects*/
        /*nextPercentage = Math.max(nextPercentage, 70);*/ /*Original*/
  
  track.dataset.percentage = nextPercentage;

  /* If dragged more than 2%, disable link under cursor*/
  if(percentage < -2 || percentage > 2){
    linkMouseDown = linkUnderCursor;
    linkUnderCursor.style.pointerEvents = "none";
  }

  
  track.animate(
    /*{transform: `translate( ${(nextPercentage -17)}% , -50%)`}, /*Values for 9 projects*/
    {transform: `translate( ${(nextPercentage -30)}% , -50%)`}, /* Values for 5 projects*/
    { duration: 1200, fill: "forwards" }
  );
  
  for(const image of track.getElementsByClassName("image")) {
    image.animate({
      objectPosition: `${100 + nextPercentage}% center`
    }, { duration: 1200, fill: "forwards" });
  }
}

/* -- Had to add extra lines for touch events -- */

window.onmousedown = e => handleOnDown(e);

window.ontouchstart = e => handleOnDown(e.touches[0]);

window.onmouseup = e => handleOnUp(e);

window.ontouchend = e => handleOnUp(e.touches[0]);

window.onmousemove = e => handleOnMove(e);

window.ontouchmove = e => handleOnMove(e.touches[0]);
