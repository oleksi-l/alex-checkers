(this["webpackJsonpalex-checkers"]=this["webpackJsonpalex-checkers"]||[]).push([[0],{11:function(e,t,n){e.exports=n(17)},16:function(e,t,n){},17:function(e,t,n){"use strict";n.r(t);var r=n(0),c=n.n(r),a=n(4),i=n.n(a),s=n(2),o=n(1),l=n(5),u=n(6),f=n(10),h=n(8),k=(n(16),n(7)),v=n.n(k),b=function(e){var t=e.prop,n=Object(r.useContext)(M),a=n.activeChecker,i=n.toggleActive,s=t.name===a?"active":"";return c.a.createElement("div",{onClick:function(){return i(t)},className:"checker ".concat(t.color," ").concat(s)},t.isQueen&&c.a.createElement("img",{className:"checker-icon",src:v.a,alt:"queen"}))},d=c.a.memo((function(e){var t=Object(r.useContext)(M),n=t.checkers,a=t.turns,i=t.checkersName,s=t.moveChecker,o=function(e,t,n){return e&&0!==e.length&&e.includes(n)&&t.includes(n)?"active":""}(a,t.freeCells,e.name);return c.a.createElement("li",{className:"row-item ".concat(o),onClick:function(){return s(e,o)}},i.includes(e.name)&&c.a.createElement(b,{prop:n[e.name]}))})),m=function(e){var t=e.cells;return c.a.createElement("ul",{className:"row"},t.map((function(e,t){return c.a.createElement(d,{key:e.name,name:e.name,x:e.x,y:e.y})})))},y=["a","b","c","d","e","f","g","h"],p=function(){var e=new Array(8).fill(0,0,8);return e.map((function(t,n){return e.map((function(e,t){return{name:"".concat(y[t]).concat(n+1),x:n+1,y:t+1}}))}))}(),g=function(e){e=e.flat();for(var t={},n=0;n<e.length;n++)t[e[n].name]={x:e[n].x,y:e[n].y};return t}(p),O=function(e,t){var n={};return e.filter((function(e,r){t%2===0?r%2===0&&(n[e.name]=e):r%2!==0&&(n[e.name]=e)})),n},j=function(){for(var e={},t=0;t<p.length;t++)(t<=2||t>=5)&&(e=Object.assign(e,O(p[t],t)));for(var n in e)e[n].color=e[n].x<=3?"white":"black",e[n].to=e[n].x<=3?"down":"up",e[n].isQueen=!1;return e}(),C=["b4","d4","f4","h4","a5","c5","e5","g5"],B=function(){return c.a.createElement("div",{className:"board"},p.map((function(e,t){return c.a.createElement(m,{key:"row#".concat(t+1),cells:e})})))},x=n(9),w=function(e){for(var t=[],n=0;n<e.length;n++)t=t.concat(Object.keys(e[n]));return t},E=function(e){var t=e.freeCells,n=e.checkers,r=e.player,c=e.coords,a=e.checker,i=[],l={},u={};for(var f in c){var h={checker:a,coords:c[f],freeCells:t,checkers:n,player:r,to:f},k=q(h);f="left"===f?"right":"left",h=Object(o.a)(Object(o.a)({},h),{},{coords:k.bited,to:f}),u=X(h),Object.keys(u).length>0&&(l=Object.assign(l,u)),i=i.concat(k.turns),l=Object.assign(l,k.bited)}if(Object.keys(l).length>0){var v=[];for(var b in l)v.push(Object(s.a)({},b,l[b]));return{turns:[],toBite:v}}return{turns:i,toBite:[]}},S=function(e){return e=Object(o.a)(Object(o.a)({},e),{},{x:e.x-1,y:e.y-1}),{left:N(e),right:Q(e)}},A=function(e,t){var n=t.beginX,r=t.beginY,c=t.endY,a=t.checker,i=[],s=[];n+=1;for(var o=r;o<=c&&(0!==n||"right"!==e);o++){var l="right"===e?n--:n++;if(l>8)break;var u="".concat(y[o]).concat(l);a.x+1>l?s.push(u):i.push(u)}var f=i.concat(s);return(f=f.filter((function(e){return e.indexOf("undefined")<0}))).sort()},N=function(e){var t=e.x,n=e.y,r=0,c=0,a=0,i=0;return t===n&&(a=7,i=7),t<n&&(r=0===t?0:t-t,i=7,a=7-(c=0===t?n:n-t)),t>n&&(i=7-(r=t-n),a=0===(c=n-n)||7===t?7:7-c),A("left",{beginY:c,beginX:r,endY:i,endx:a,checker:e})},Q=function(e){var t=e.x,n=e.y,r=0,c=0;return t===n&&(0!==n&&7!==n||(c=n),c=(c=n>0&&n<=3?n-n:n-(7-t))<0?0:c,r=(r=0===t?0:t+t)>7?7:r),t<n&&(c=0===t?0:n<4?n-n:n-(7-t),r=7===n?7:t+n),t>n&&(c=7===t?n:0===n?0:n-(7-t),r=t+n),A("right",{beginY:c=c<0?0:c,beginX:r=r>7?7:r,endY:r,endx:c,checker:e})},Y=function(e,t,n,r){for(var c=0,a=[],i={},s=0;s<e.length;s++)if(t.includes(e[s])){if(c>1)break;a.push(e[s]),Object.keys(i).includes(e[s-1])&&(i[e[s]]=i[e[s-1]])}else if(n[e[s]]){if(n[e[s]].color===r)break;if(++c>1)break;if(e[s+1]&&n[e[s+1]]&&n[e[s+1]].color===r)break;if(e[s+1]&&t.includes(e[s+1])){if(8===+e[s][1]||1===+e[s][1])break;if("a"===e[s][0]||"h"===e[s][0])break;i[e[s+1]]=e[s]}}return{bited:i,turns:a}},X=function(e){for(var t=e.coords,n=e.freeCells,r=e.checkers,c=e.player,a=e.to,i=Object.keys(t),s={},o=0;o<i.length;o++){var l={name:i[o],x:g[i[o]].x,y:g[i[o]].y,color:c},u=S(l),f=q({checker:l,coords:u[a],freeCells:n,checkers:r,player:c});Object.keys(f.bited).length>0&&(s[l.name]=Object.keys(f.bited))}return s},q=function(e){var t,n=e.checker,r=e.coords,c=e.freeCells,a=e.checkers,i=e.player,s=[],o=r.indexOf(n.name),l=r.slice(0,o);l=l.reverse();var u=r.slice(o+1),f=Y(l,c,a,i),h=Y(u,c,a,i);return t=Object.assign({},f.bited,h.bited),{turns:s=Object(x.a)(new Set(s.concat(f.turns,h.turns))),bited:t}},D=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"turns",n=arguments.length>2?arguments[2]:void 0,r=e.x,c=e.y,a=e.to;c-=1;var i=[];if("turns"===t){var s="down"===a?1:-1;i=["".concat(y[c-1]).concat(r+s),"".concat(y[c+1]).concat(r+s)]}else i=["".concat(y[c-1]).concat(r+1),"".concat(y[c+1]).concat(r+1),"".concat(y[c-1]).concat(r-1),"".concat(y[c+1]).concat(r-1)];for(var o=[],l=0;l<i.length;l++)("turns"!==t||n.includes(i[l]))&&i[l].indexOf("undefined")<0&&o.push(i[l]);return o},J=function(e,t,n){for(var r=D(e,"bite",n),c={},a=[],i=[],o=0;o<r.length;o++)if(t[r[o]]){if(t[r[o]].color===e.color)continue;var l=t[r[o]].y,u=t[r[o]].x,f=e.y<l?l+1:l-1,h=e.x<u?u+1:u-1,k="".concat(y[f-1]).concat(h);if(k.indexOf("undefined")>-1||!n.includes(k))continue;a.push(k),i.push(Object(s.a)({},k,t[r[o]].name)),c[e.name]=i}return{bited:c,turns:a}},M=c.a.createContext(),P=function(e){Object(f.a)(n,e);var t=Object(h.a)(n);function n(){var e;return Object(l.a)(this,n),(e=t.call(this)).checkWinner=function(t){var n=e.state,r=n.checkers,c=n.toBite,a=n.turns,i=[];for(var s in r)r[s].color===t&&i.push(s);return(0===i.length||0===Object.keys(c).length&&0===Object.keys(a).length)&&t},e.toggleActive=function(t){var n=t.name,r=t.color,c=e.state,a=c.player,i=c.turns;a===r&&Object.keys(i).includes(n)&&e.setState({activeChecker:n})},e.scanBoard=function(t){var n={},r={},c={},a=e.state,i=a.checkers,s=a.freeCells,l=a.player;for(var u in i)if(i[u].color===t){var f=J(i[u],i,s),h=D(i[u],"turns",s);if(i[u].isQueen){var k=E({coords:S(i[u]),checker:i[u],freeCells:s,checkers:i,player:l});Object.keys(k.toBite).length>0?(f.turns=w(k.toBite),f.bited[u]=k.toBite):f.turns=k.turns,h=k.turns}if(Object.keys(f.bited).length>0){r=Object(o.a)(Object(o.a)({},r),f.bited),c[u]=f.turns;continue}h.length>0&&(n[u]=h)}return Object.keys(c).length>0?{turns:c,willBeBited:r}:{turns:n,willBeBited:r}},e.replaceChecker=function(t){var n=e.state,r=n.activeChecker,c=n.checkers,a=n.freeCells,i=n.toBite,s=Object(o.a)(Object(o.a)({},c[r]),{},{name:t.name,x:t.x,y:t.y}),l=0,u="";if(i[r]){for(var f=0;f<i[r].length;f++)if(Object.keys(i[r][f]).includes(t.name)){u=i[r][f][t.name];break}delete c[u],(a=a.filter((function(e){return e!==t.name&&e!==u}))).push(u),l=1}else a=a.filter((function(e){return e!==t.name}));return delete c[r],c[t.name]=s,a.push(r),{checkers:c,freeCells:a,wasBited:l}},e.biteAgain=function(t,n){var r=e.scanBoard(t),c=r.turns,a=r.willBeBited;Object.keys(c).length>0&&Object.keys(a).includes(n)?e.setState({turns:c,toBite:a}):e.setState({player:"white"===t?"black":"white",activeChecker:null})},e.moveChecker=function(t,n){var r=e.state,c=r.freeCells,a=r.player;if(c.includes(t.name)&&"active"===n){var i=e.replaceChecker(t),s=i.checkers,l=i.freeCells,u=i.wasBited;s[t.name].isQueen||("down"===s[t.name].to&&8===t.x||"up"===s[t.name].to&&1===t.x)&&(s[t.name].isQueen=!0,u=1),1===u?e.setState((function(e){return Object(o.a)(Object(o.a)({},e.state),{},{activeChecker:t.name,checkers:s,freeCells:l})}),(function(){return e.biteAgain(a,t.name)})):e.setState({checkers:s,freeCells:l,activeChecker:null,player:"white"===a?"black":"white"})}},e.state={activeChecker:null,freeCells:C,checkers:j,player:"white",turns:{},toBite:{}},e}return Object(u.a)(n,[{key:"componentDidMount",value:function(){var e=this.scanBoard(this.state.player);this.setState({turns:e.turns,toBite:e.willBeBited})}},{key:"componentDidUpdate",value:function(e,t){var n=this,r=this.state,c=r.player,a=r.activeChecker,i=r.checkers,o=r.toBite;if(t.player!==c){var l=this.scanBoard(c);this.checkWinner(c)?alert("Player ".concat(c.toUpperCase(),", you lose!!! (")):this.setState({turns:l.turns,toBite:l.willBeBited})}else if(a&&i[a].isQueen&&o[a]&&Object.keys(o[a]).length>0&&t.toBite!==o){var u=function(e,t,n){var r=[],c=[];for(var a in e)for(var i=0;i<e[a].length;i++)r=r.concat(Object.keys(e[a][i]));return t[n]&&(t[n]=t[n].filter((function(e){var t=Object.keys(e).join("");if(!r.includes(t))return c.push(t),e}))),{bited:t,turns:c}}(t.toBite,o,a);u.turns.length>0?this.setState({toBite:u.bited,turns:Object(s.a)({},a,u.turns)}):this.setState((function(e){return{player:"white"===c?"black":"white",activeChecker:null}}),(function(){return n.scanBoard(n.state.player)}))}}},{key:"render",value:function(){var e=this.state,t=e.activeChecker,n=e.checkers,r=e.freeCells,a=e.turns,i=e.player,s=e.toBite;return c.a.createElement(M.Provider,{value:{activeChecker:t,checkers:n,checkersName:Object.keys(n),freeCells:r,turns:t?a[t]:[],toBite:s,toggleActive:this.toggleActive,moveChecker:this.moveChecker}},c.a.createElement("div",{className:"App"},c.a.createElement("h3",null,i),c.a.createElement(B,null)))}}]),n}(c.a.Component);i.a.render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(P,null)),document.getElementById("root"))},7:function(e,t,n){e.exports=n.p+"static/media/queen.4a25f75f.svg"}},[[11,1,2]]]);
//# sourceMappingURL=main.e25bbbd8.chunk.js.map