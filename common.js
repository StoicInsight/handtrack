
class vec2
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
    length()
    {   
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    scale(s)
    {
        this.x *= s;
        this.y *= s;
    }
    vmul(s)
    {
        this.x *= s.x;
        this.y *= s.y;
    }
}
class circle
{
    constructor(c, r)
    {
        this.c = c;
        this.r = r;
    }
    
    is_in_circle(p)
    {
        var diff = new vec2(this.c.x-p.x, this.c.y-p.y);
        var dist = diff.length();
        console.log(`dist: ${dist}`)
        return ((dist-this.r)<=0.0)?true:false;
    }
}
class debugviz
{
    constructor(obj)
    {
        this.ctx = obj;
    }

    draw_circle(circ)
    {
        this.ctx.strokeStyle = "green";
        this.ctx.fillStyle = "green";
        this.ctx.beginPath();
        this.ctx.ellipse(circ.c.x, circ.c.y, circ.r, circ.r, 0, 0, Math.PI*2.0);
        this.ctx.stroke()
        return;
    }
}

function clamp(min, max, x)
{
    return (x<min?min:
            x>max?max:x);
}


function clampedcenter(x1, y1, x2, y2, minw, maxw, minh, maxh)
{
    var c = new vec2(0.5*(clamp(minw, maxw, x2) - clamp(minw, maxw, x1)), 0.5*(clamp(minh, maxh, y2) - clamp(minh, maxh, y1)));
    c.x = x1 + c.x;
    c.y = y1 + c.y;
    return c;
}

