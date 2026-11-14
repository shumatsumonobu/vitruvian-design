# Charts

A chart earns its place by answering one question faster than the table of the same numbers would
— which is larger, which way it is going, where it broke. Where it does not, the table is the
better screen. Most of what goes wrong in a chart is a form chosen before the question was.

## The question picks the form

- A comparison between named things is bars, laid along one axis from a shared baseline.
- A change over time is a line, or bars where the periods are few and each is read on its own.
- A share of a whole is one bar divided into its parts. A pie, a donut, or a gauge asks the reader
  to compare angles and arcs, which the eye reads worse than lengths, and it is the form that
  arrives when nobody asked the question.
- Past seven categories or series, the reader hunts a legend instead of reading the chart, and the
  numbers go in a table, or the chart shows the few that answer the question and says what it left
  out.

## The axes tell the truth

- One value axis. Two value axes on one chart invite a comparison between two scales nobody chose,
  and the place where the lines cross means nothing.
- Bars start at zero, since their length is the value. A line may start elsewhere when the change
  is the point, and the chart says where its axis starts.

## Color carries the series, not the words

- A series keeps its color on every chart in the product, and keeps it when a filter takes another
  series away. The colors come from the declaration, as every color does (rules/anti-slop.md).
- Text — a title, a label, a value — is set in the declaration's text colors, not in a series'
  color: a label tinted to its series reads by color alone, and on the lightest series it falls
  below contrast.
- What tells the series apart besides their color, and what a screen reader receives from a chart,
  are rules/a11y.md's.

## Inspection

Read each chart on the running screen at every checked size, and its source for the axes.

### The count

- Charts showing a share of a whole as a pie, a donut, or a gauge: 0.
- Charts with more than one value axis: 0.
- Bar charts whose value axis does not start at zero, and line charts whose value axis starts
  elsewhere with nothing on the chart saying where it starts: 0.
- Charts carrying more than seven categories or series: 0.
- Charts showing some of the categories or series with nothing on the chart naming what it left
  out: 0.
- Chart text — a title, a label, a value — set in a series' color: 0.
- Series whose color differs between two charts in the product, or changes when a filter changes
  what else is shown: 0.

### The checks

- Each chart's question. Say in one sentence what it answers faster than the table of its numbers.
  A chart whose question cannot be said goes on the repair list.

## Platform notes

- Web: a chart drawn in SVG or on a canvas gives a screen reader nothing from its shapes; the text
  it carries instead, beside it or behind a disclosure, is what rules/a11y.md reads.
