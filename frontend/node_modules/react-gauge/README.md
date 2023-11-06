# React Gauge
![Gauge Example](react-gauge-example.gif?raw=true)

# Install
```
npm install react-gauge --save
```

# Usage
Default usage
```
<Gauge value={25}/>
```
Change the color of the Gauge
```
<Gauge value={25} primaryColor="#7D9F35"/>
```
Instead of a color, use [gradients](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Gradients)! Take an array of objects with width a stop percent value (e.g. `p: 50`) and a color (e.g. `color: $ffff00`) and we'll render an SVG gradient.
```
<Gauge
  value={25}             
  gradient={[
    {p: 0, color: "#ff0000"},
    {p: 50, color: "#ffff00"},
    {p: 75, color: "#ffc107"},
    {p: 100, color: "#00920b"},
  ]}
  />
```

# Contributing
We don't have any tests, but we do have an example HTML file to test out changes.

### First, install
```
npm install
```
Then after making your changes...
###  Build your changes into `dist`
```
npm run build:src
```
### Example
To "test" out your changes, build the example code...
```
npm run build:example
```
...then open the [example HTML file](https://github.com/michigan-com/react-gauge/tree/master/example/example.html) in your browser.
