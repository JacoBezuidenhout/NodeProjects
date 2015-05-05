var nodes = [];
var socket;
var gauge;

function start()
{
    var e = document.getElementById("node_select");
    var x = e.options[e.selectedIndex].value;
    console.log(x);
    sendAction(x,'start','DB',2000);
}

function stop()
{
  sendAction('','stop','',2000);
  gauge.setValue("N/A");
}

gauge = new Gauge({
  renderTo    : 'gauge',
  width       : 400,
  height      : 400,
  glow        : true,
  units       : '-dbi',
  title       : false,
  minValue    : 0,
  maxValue    : 110,
  majorTicks  : ['0','10','20','30','40','50','60','70','80','90','100','110'],
  minorTicks  : 2,
  strokeTicks : false,
  highlights  : [
    { from : 0,   to : 50, color : 'rgba(0,   255, 0, .5)' },
    { from : 50, to : 90, color : 'rgba(255, 255, 0, .5)' },
    { from : 90, to : 110, color : 'rgba(255, 30,  0, .5)' }
  ],
  colors      : {
    plate      : '#222',
    majorTicks : '#f5f5f5',
    minorTicks : '#ddd',
    title      : '#fff',
    units      : '#ccc',
    numbers    : '#eee',
    needle     : { start : 'rgba(240, 128, 128, 1)', end : 'rgba(255, 160, 122, .9)' }
  }
});

gauge.onready = function() {
  socket = io('http://localhost');
  socket.on('mesh', function (data) {

    var e = document.getElementById("node_select");
    var x = "";

    if (typeof e.options[e.selectedIndex] !== 'undefined')
      x = e.options[e.selectedIndex].value;

    if (data.command == "DB" && data.remote64 == x)
    {
      if (data.commandStatus == 0)
        gauge.setValue(data.commandData.data[0]);
      else
        gauge.setValue(110);
    }

    if (data.command == "NI")
      {
        var id = JSON.stringify({"id":data.remote64,"NI":data.commandData.data});
        var flag = false;

        for (i = 0; i < nodes.length; i++)
          if (nodes[i] == id) flag = true;

        if (flag == false) {
          nodes.push(id);

          var sel = document.getElementById('node_select');
          var opt = document.createElement('option');
          opt.innerHTML = id;
          opt.value = data.remote64;
          sel.appendChild(opt);

        }
      }
    // console.log(data);
  });
  drawMap();
};

function sendAction(ID,ACTION,CMD,TO)
{
  socket.emit('action', { id: ID, action: ACTION, cmd: CMD, timeout: TO});
}

gauge.draw();
