import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express';
import { RequestContext } from 'nestjs-request-context';

@Injectable()
export class DumpService {
  json(data: unknown): void {
    const httpContext = RequestContext.currentContext;
    if (httpContext) {
      const res: Response = httpContext.res;
      res.set('Content-Type', 'text/html');
      res.send(Buffer.from(String.raw`
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<style type="text/css">
body {
margin: 0;
padding: 0;
width: 98%;
background: #CCC;
margin: 5px auto 100px;
}
#json-input {
display: none;
width: 100%;
height: 200px;
}
#translate {
display: none;
height: 28px;
margin: 20px 0;
border-radius: 3px;
border: 2px solid;
cursor: pointer;
}
#json-display {
border: 1px solid #000;
margin: 0;
padding: 2px 2px;
}
</style>
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" crossorigin="anonymous"></script>
<script>!function(){var e='/* Syntax highlighting for JSON objects */ .json-editor-blackbord {   background: #1c2833;   color: #fff;   font-size: 13px;   font-family: Menlo,Monaco,Consolas,"Courier New",monospace; } @media screen and (min-width: 1600px) {   .json-editor-blackbord {     font-size: 14px;   } }  ul.json-dict, ol.json-array {   list-style-type: none;   margin: 0 0 0 1px;   border-left: 1px dotted #525252;   padding-left: 2em; } .json-string {   /*color: #0B7500;*/   /*color: #BCCB86;*/   color: #0ad161; } .json-literal {   /*color: #1A01CC;*/   /*font-weight: bold;*/   color: #ff8c00; } .json-url {   color: #1e90ff; } .json-property {   color: #4fdee5;   line-height: 160%;   font-weight: 500; }  /* Toggle button */ a.json-toggle {   position: relative;   color: inherit;   text-decoration: none;   cursor: pointer; } a.json-toggle:focus {   outline: none; } a.json-toggle:before {   color: #aaa;   content: "\\25BC"; /* down arrow */   position: absolute;   display: inline-block;   width: 1em;   left: -1em; } a.json-toggle.collapsed:before {   transform: rotate(-90deg); /* Use rotated down arrow, prevents right arrow appearing smaller than down arrow in some browsers */   -ms-transform: rotate(-90deg);   -webkit-transform: rotate(-90deg); }   /* Collapsable placeholder links */ a.json-placeholder {   color: #aaa;   padding: 0 1em;   text-decoration: none; } a.json-placeholder:hover {   text-decoration: underline; }',o=function(e){var o=document.getElementsByTagName("head")[0],t=document.createElement("style");if(o.appendChild(t),t.styleSheet)t.styleSheet.disabled||(t.styleSheet.cssText=e);else try{t.innerHTML=e}catch(n){t.innerText=e}};o(e)}(),function(e){function o(e){return e instanceof Object&&Object.keys(e).length>0}function t(e){var o=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;return o.test(e)}function n(e,s){var l="";if("string"==typeof e)e=e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),l+=t(e)?'<a href="'+e+'" class="json-string json-url">"'+e+'"</a>':'<span class="json-string">"'+e+'"</span>';else if("number"==typeof e)l+='<span class="json-literal json-literal-number">'+e+"</span>";else if("boolean"==typeof e)l+='<span class="json-literal json-literal-boolean">'+e+"</span>";else if(null===e)l+='<span class="json-literal json-literal-null">null</span>';else if(e instanceof Array)if(e.length>0){l+='[<ol class="json-array">';for(var r=0;r<e.length;++r)l+="<li>",o(e[r])&&(l+='<a href class="json-toggle"></a>'),l+=n(e[r],s),r<e.length-1&&(l+=","),l+="</li>";l+="</ol>]"}else l+="[]";else if("object"==typeof e){var a=Object.keys(e).length;if(a>0){l+='{<ul class="json-dict">';for(var i in e)if(e.hasOwnProperty(i)){l+="<li>";var c=s.withQuotes?'<span class="json-string json-property">"'+i+'"</span>':'<span class="json-property">'+i+"</span>";l+=o(e[i])?'<a href class="json-toggle">'+c+"</a>":c,l+=": "+n(e[i],s),--a>0&&(l+=","),l+="</li>"}l+="</ul>}"}else l+="{}"}return l}e.fn.jsonViewer=function(t,s){return s=s||{},this.each(function(){var l=n(t,s);o(t)&&(l='<a href class="json-toggle"></a>'+l),e(this).html(l),e(this).off("click"),e(this).on("click","a.json-toggle",function(){var o=e(this).toggleClass("collapsed").siblings("ul.json-dict, ol.json-array");if(o.toggle(),o.is(":visible"))o.siblings(".json-placeholder").remove();else{var t=o.children("li").length,n=t+(t>1?" items":" item");o.after('<a href class="json-placeholder">'+n+"</a>")}return!1}),e(this).on("click","a.json-placeholder",function(){return e(this).siblings("a.json-toggle").click(),!1}),1==s.collapsed&&e(this).find("a.json-toggle").click()})}}(jQuery),function(e){function o(e){var o={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","	":"\\t"};return e.replace(/["\\\b\f\n\r\t]/g,function(e){return o[e]})}function t(e){if("string"==typeof e)o(e);else if("object"==typeof e)for(var n in e)e[n]=t(e[n]);else if(Array.isArray(e))for(var s=0;s<e.length;s++)e[s]=t(e[s]);return e}function n(o,t,n){n=n||{},n.editable!==!1&&(n.editable=!0),this.$container=e(o),this.options=n,this.load(t)}n.prototype={constructor:n,load:function(e){e=t(e),this.$container.jsonViewer(t(e),{collapsed:this.options.defaultCollapsed,withQuotes:!0}).addClass("json-editor-blackbord").attr("contenteditable",!!this.options.editable)},get:function(){try{return e(".collapsed").click(),JSON.parse(this.$container.text())}catch(o){alert("Wrong JSON Format: "+o)}}},window.JsonEditor=n}(jQuery);
</script>

</head><body><textarea id="json-input" autocomplete="off">
{obj_json}
</textarea>
<button id="translate">Translate</button>
<pre id="json-display"></pre>

<script type="text/javascript">
function getJson() {
try {
return JSON.parse($('#json-input').val());
} catch (ex) {
alert('Wrong JSON Format: ' + ex);
}
}

var editor = new JsonEditor('#json-display', getJson());
$('#translate').on('click', function () {
editor.load(getJson());
});
</script>
</body>
</html>`.replace('{obj_json}', JSON.stringify(data))));
    //   res.send(JSON.stringify(data));
    throw new Error('json_dump');
    }
  }
}
