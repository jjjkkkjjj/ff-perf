# Fitness Fatigue Performance Curve Generator

URL: [https://jjjkkkjjj.github.io/ff-perf/](https://jjjkkkjjj.github.io/ff-perf/)

## Design

| Type              | Color   |
| ----------------- | ------- |
| Base              | #FFD12B |
| Split Complement1 | #672BFF |
| Split Complement2 | #392BFF |
| Background        | #F3DB85 |
| Mouse over        | #CCCCCC |



- Font
  - Title: Bangla MN

- Responsive Breakpoint
  - common
    - tablet: ~`1024px`
    - phone: ~`599px`
  - title
    - title: ~`1200px`

## Math

```latex
\usepackage{amsmath}
\usepackage{amsfonts}
\usepackage{amssymb}
\usepackage{calc}  
\usepackage{enumitem} 

\begin{description}[leftmargin=!,labelwidth=\widthof{\bfseries The longest label}]
  \item [Performance] $p(t) = k_1g(t) - k_2h(t)$
  \item [Fitness] $g(t) = w(t)\exp{\left(-\frac{1}{\tau_1}\right)}$
  \item [Fatigue] $h(t) = w(t)\exp{\left(-\frac{1}{\tau_2}\right)}$
  \item [$w(t)$] TRIMP
  \item [$k_1$] The weight of fitness to calculate performance
  \item [$k_2$] The weight of fatigue to calculate performance
  \item [$\tau_1$] The time coefficient of fitness
  \item [$\tau_2$] The time coefficient of fatigue
\end{description}
```

## Installation

```
npm install -g webpack webpack-cli
npm install --save-dev webpack webpack-cli jquery jquery-ui jsdom gridjs css-loader style-loader url-loader papaparse moment chart.js@2.9.4 file-saver
```

### build
```
cd docs
bash build.sh
```

## Dependencies
For the best performance, add the specific paths like;

```
git add -f bower_components/file
```

## Debug

- Active `Live server`.
- Click `F5`
