document.body.onload = () => {

    const myspace = document.getElementById("myspace");
    myspace.height = window.innerHeight;
    myspace.width = window.innerWidth;
    myspace.style.height= myspace.height.toString()+"px";
    const spacectx = myspace.getContext("2d");

    const max_opacity = 70;
    const min_opacity = 20;

    const max_size = 4;
    const min_size = 0;

    const total_nodes = 5000;
    const node_base_color = "ffffff";


    class node {
        constructor(x, y,size,x_dir,y_dir,opacity) {
  
          this.x = x;
          this.y = y;
          // this.x_dir = x_dir;
          this.x_dir = 0;
          this.y_dir = y_dir;
          this.size = size;
          this.opacity = opacity; 
        }
  
        draw()
        {
              spacectx.fillStyle = "#"+node_base_color+this.opacity;
              spacectx.rect(this.x, this.y, this.size*2, this.size);
        }
  
        update()
        {
          this.x += this.x_dir;
          this.y += this.y_dir;
        }
  
        change(x, y,size,x_dir,y_dir,opacity)
        {
          this.x = x;
          this.y = y;
          this.x_dir = x_dir;
          this.y_dir = y_dir;
          this.size = size;
          this.opacity = opacity; 
        }
  
        distance(x,y)
        {
          let a = Math.abs(this.x-x);
          let b = Math.abs(this.y-y);
          let dis = Math.sqrt(a*a + b*b);
          return dis;
        }
  
        current_pos()
        {
          return [this.x,this.y];
        }
        revertX()
        {
          this.x_dir *= -1;
        }
        revertY()
        {
          this.y_dir *= -1;
        }
      }
  
  
      spacectx.beginPath();
      var nodes = new Array()
  
      for (let i=1;i<=total_nodes;i++)
      {
        nodes.push(new node(Math.random() * myspace.width | 0,Math.random() * myspace.height | 0,( Math.random()*(max_size-min_size) + min_size | 0 ) + 1,Math.random() * 2 - 1 ,Math.random() * 2 - 1 ,(Math.random() * (max_opacity-min_opacity) + min_opacity | 0).toString()));
      }
  
      setInterval(() => {
        spacectx.clearRect(0,0,myspace.width,myspace.height);
        // var last_node = [-100,-100];
        spacectx.beginPath();
        nodes.forEach((n)=>{
          
          // if(n.x < 0 || n.x > myspace.width || n.y < 0 || n.y > myspace.height)
            // n.change(Math.random() * myspace.width | 0,Math.random() * myspace.height | 0,( Math.random()*(max_size-min_size) + min_size | 0 ) + 1,Math.random() * 2 - 1 ,Math.random() * 2 - 1 ,(Math.random() *  (max_opacity-min_opacity) + min_opacity | 0).toString());
          if(n.x < 0 || n.x > myspace.width)
            n.revertX();
          else if(n.y < 0 || n.y > myspace.height)
            n.revertY();
            //console.log(last_node,n.distance(last_node[0],last_node[1]));
            // if (n.distance(last_node[0],last_node[1] > 200 )){
              spacectx.closePath();
              spacectx.fill();
              spacectx.beginPath();
            // }
            n.draw();
            n.update();
            // last_node = n.current_pos();
          
        });
      },50);

      const game = document.getElementsByClassName("game")[0]
      const button = document.getElementsByClassName("button")[0] 
      const quoteBlock = document.getElementsByTagName("blockquote")[0]
      const timer = document.getElementsByClassName("timer")[0]


      const replacments = 6;

      const run = () => {
        var author;
        var quote;
        var html;
        var replacment = []

        var answers = new Array(replacments);

        const selectInd = (event) => {
            Array.from(document.getElementsByClassName("selectedInd")).forEach(e=>e.classList.remove("selectedInd"))
            Array.from(document.getElementsByClassName(event.currentTarget.classList.item(1))).forEach(e=>e.classList.add("selectedInd"))
        }
        
        // console.log(replacment)
        button.style.visibility = "hidden"
        quoteBlock.style.display = "none"
        fetch("https://salimking.pythonanywhere.com/api/quotes/random").then(r=>r.json()).then(r=>{
                // console.log(r[0])
                author = r[0].a
                quote = r[0].q.toLowerCase();
                html = r[0].h

                var style = document.createElement('style');
                for(let i=0;i<replacments;i++){
                    do{
                        var rand = Math.random() * 26 | 0;
                    }while(replacment.includes(rand) || ! quote.includes(String.fromCharCode(rand+97)));
                    replacment.push(rand)
                    style.innerHTML += `
                        .ind-${i}:before {
                            content: "${i+1}";
                            position :relative;
                            top:4vh;
                            /*font-space : */
                        }
                    `;
                } 
                
                
                document.head.appendChild(style);

                for(let index=0;index<quote.length;index++)
                {
                    let ascii = replacment.indexOf(quote.charCodeAt(index)-97)
                    if(ascii!=-1)
                    {
                        game.innerHTML += `<strong class="crypted ind-${ascii}"></strong>`
                        // let crypted = document.getElementsByClassName("crypted")
                        // console.log(crypted[crypted.length-1])
                        // crypted[crypted.length-1].addEventListener("click",selectInd)
                    }
                    else
                        game.innerHTML += quote.charAt(index)
                    
                    if ((index+1)%80==0)
                    {
                      game.innerHTML += "<div></div>"
                    }
                }

                Array.from(document.getElementsByTagName("strong")).forEach(e=>e.addEventListener("click",selectInd))

                timer.innerHTML = "0"

                timerInt = setInterval(()=>{
                  timer.innerHTML = parseInt(timer.innerHTML)+1 
                },1000)

                document.addEventListener("keydown", event =>{
                  
                  var key = event.key.toLowerCase()
                  var selectInd = document.getElementsByClassName("selectedInd")
                  if(selectInd.length>0 && key.length==1 && key.charCodeAt(0)>=97 && key.charCodeAt(0)<=97+25 )
                  {
                    Array.from(selectInd).forEach(e=>e.innerHTML=`<small>${key}</small>`)
                    answers[selectInd[0].classList.item(1).split('-')[1]] = key.charCodeAt(0)-97
                    // console.log(replacment)
                    // console.log(answers)
                    if(!answers.includes(undefined))
                    {
                      // answers.forEach((v,e)=>{
                      //   if(v != replacment[e])
                      //     return;
                      // });
                      for(let e=0;e<answers.length;e++)
                      {
                        if(answers[e] != replacment[e])
                          return;
                      }
                      replacment = []
                      answers = [] 
                      setTimeout(()=>{
                        quoteBlock.innerHTML = html
                        game.innerHTML = ''
                        button.style.visibility = "visible"
                        quoteBlock.style.display = "block"
                        clearInterval(timerInt)
                        timer.innerHTML = ''
                      },2000) 
                      
                    }
                  }
                });

            })
        }
    
    button.addEventListener("click",run)

}
