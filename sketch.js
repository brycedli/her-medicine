// function setup () {
//   createCanvas(windowWidth, windowHeight);

// }

// function draw () {
//   background(128);
//   fill(0);
//   circle(width/2, height/2, 50)
// }

window.onload = function () {
    let currentlyOn = false;
    const items = [
        'eat a churro',
        'breathe out of your nose',
        'wear socks',
        'listen to music',
        'have short nails',
        'wear non-striped patterns',
        'see the color blue',
        'touch water',
        'be able to jump',
        'taste salty food',
        'feel the breezy morning fog',
        'try a new food',
        'sing to the Friends theme song',
        'pet an animal',
        'pick flowers',

    ];
    const costs = [
        'naming your first child after a common kitchen appliance',
        'completely losing your memory of your first pet',
        'never having your shoes tied',
        'always feeling slightly too cold',
        'waking up to bagpipes every morning',
        'having to swim to get to school/work every day',
        'having to wear a shirt with a breast pocket every day',
        'not being able to pronounce the “th” sound',
        'always confusing the letters “g” and “j”',
        'always getting paper cuts when you open books',
        'only being able to laugh at a joke after everyone else finishes laughing',
        'only being able to move through hopscotching',
        'having to wear sunglasses in the dark',
    ]
    const doors = document.querySelectorAll('.door');

    doors[0].dataset.doortype = 'thing';
    doors[1].dataset.doortype = 'cost';

    console.log(document.querySelector('#sentenceContainer'));
    document.querySelector('#sentenceContainer').addEventListener('click', spin);
    document.querySelector('#closeModal').addEventListener('click', function () {
        document.querySelector('#overlayBox').hidden = true;
        // document.querySelector('#overlayBox').style = 'display="none"'
    });
    // document.querySelector('#sentenceContainer').addEventListener('click', init);

    function init(firstInit = true, groups = 1, duration = 1) {
        
        let pillContainer = document.getElementById("pillHolder");
        
        pillContainer.classList.remove("pulse");
        console.log("init");
        let pill = document.getElementById("pillDiv");
        if (pill){
            pill.remove();
            // pill.className = "lower";
            const cover =  document.getElementById("pillCover");
            const newDiv = document.createElement("div");
            // newDiv.style.order = "0";
            newDiv.id = "pillDiv";
            pillContainer.insertBefore(newDiv, cover);

            const half1 = document.createElement("img");
            const half2 = document.createElement("img");
            newDiv.appendChild(half1);
            newDiv.appendChild(half2);
            half1.src = "assets/images/half1.png";
            half2.src = "assets/images/half2.png";
            // 
            // cover.style.order="1";
        }
        for (const door of doors) {
            door.dataset.spinned = '0';
            // if (firstInit) {
            //     door.dataset.spinned = '0';
            // } else if (door.dataset.spinned === '1') {
            //     return;
            // }

            const boxes = door.querySelector('.boxes');
            const boxesClone = boxes.cloneNode(false);
            let pool = [''];
            if (door.dataset.doortype == 'thing') {
                pool = ['(do something ordinary)'];
            }
            if (door.dataset.doortype == 'cost') {
                pool = ['(a difficult and oddly specific cost)'];
            }
            if (!firstInit) {
                const arr = [];
                for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
                    if (door.dataset.doortype == 'thing') {
                        arr.push(...items);
                    }
                    if (door.dataset.doortype == 'cost') {
                        arr.push(...costs);
                    }
                }
                pool.push(...shuffle(arr));
                if (door.dataset.doortype == 'thing') {
                    let needTarget = document.getElementById("need");
                    needTarget.innerText = pool[pool.length-1].toUpperCase();;
                }
                if (door.dataset.doortype == 'cost') {
                    let costTarget = document.getElementById("cost");
                    costTarget.innerText = pool[pool.length-1];
                }
                boxesClone.addEventListener(
                    'transitionstart',
                    function () {
                        door.dataset.spinned = '1';
                        this.querySelectorAll('.box').forEach((box) => {
                            // box.style.filter = 'blur(1px)';
                        });
                    },
                    { once: true }
                );

                boxesClone.addEventListener(
                    'transitionend',
                    function () {
                        this.querySelectorAll('.box').forEach((box, index) => {
                            // box.style.filter = 'blur(0)';
                            if (index > 0) this.removeChild(box);
                            // dropPill();
                        });
                    },
                    { once: true }
                );
            }
            
            for (let i = pool.length - 1; i >= 0; i--) {
                const box = document.createElement('div');
                box.classList.add('box');
                box.style.width = door.clientWidth + 'px';
                box.style.height = door.clientHeight + 'px';
                box.textContent = pool[i];
                
                boxesClone.appendChild(box);
            }
            

            boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
            boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
            door.replaceChild(boxesClone, boxes);
        }
    }

    async function spin(e) {
        console.log(e, this.id);
        if (this.id == "pillHolder"){
            return;
        }
        if (currentlyOn){
            return;
        }
        currentlyOn = true;
        init(false, 1, 2);

        for (const door of doors) {
            const boxes = door.querySelector('.boxes');
            const duration = parseInt(boxes.style.transitionDuration);
            boxes.style.transform = 'translateY(0)';
            await new Promise((resolve) => setTimeout(resolve, duration * 100));

        }
        
        setTimeout(() => {
            openPill();
        }, 2000);
        setTimeout(() => {
            pillDrop();
        }, 3000);
        setTimeout(() => {
            currentlyOn = false;
            pillPulse();
        }, 5000);
    }

    function shuffle([...arr]) {
        let m = arr.length;
        while (m) {
            const i = Math.floor(Math.random() * m--);
            [arr[m], arr[i]] = [arr[i], arr[m]];
        }
        return arr;
    }

    function openPill() {
        let pillContainer = document.getElementById("pillHolder");
        pillContainer.className = "isActive"
    }
    function pillDrop() {
        let pill = document.getElementById("pillDiv");
        pill.className = "fall"
    }
    function pillPulse(){
        let pillContainer = document.getElementById("pillHolder");
        pillContainer.classList.remove("isActive");
        let pill = document.getElementById("pillDiv");
        pill.className = "pulse"
        pill.addEventListener("click", function (e) {
            e.stopPropagation();
            pill.className = "open"
            let overlayBox = document.getElementById("overlayBox");
            overlayBox.hidden = false;
        })
    }
    init();
};
