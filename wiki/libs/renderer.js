/**
 * Created by Le Reveur on 2017-04-24.
 */

function Renderer(){

}
Renderer.prototype.heading = function(data) {
    return '<h'
        + data.level
        + ' id="'
        + encodeURIComponent(data.text)
        + '">'
        + data.text
        + '</h'
        + data.level
        + '>\n';
};
Renderer.prototype.italicbold = function(data){
    return '<b><i>'+data.text+'</i></b>';
};

Renderer.prototype.italic = function(data){
    return '<i>'+data.text+'</i>';
};

Renderer.prototype.bold = function(data){
    return '<b>'+data.text+'</b>';
};

Renderer.prototype.underline = function(data){
    return '<u>'+data.text+'</u>';
};

Renderer.prototype.sup = function(data){
    return '<sup>'+data.text+'</sup>';
};

Renderer.prototype.sub = function(data){
    return '<sub>'+data.text+'</sub>';
};

Renderer.prototype.del = function(data){
    return '<del>'+data.text+'</del>';
};

Renderer.prototype.newline = function(){
    return '<br />'
};

Renderer.prototype.link = function(data){
    var text = (data.text ? data.text : data.href);
    return '<a href="\/wiki\/view\/'+data.href+'" title="'+text+'">'+text+'</a>';
};

Renderer.prototype.urlLink = function(data){
    var text = (data.text ? data.text :data.href);
    return `<a class="wiki_ext_link" href="${data.href}" title="${text}">${text}<i class="external square icon"></i></a>`;
};

Renderer.prototype.image = function(data){
    return '<img src="'+data.src+'" />';
};

Renderer.prototype.text = function(data){
    return data.text;
};

//footnote reference
Renderer.prototype.rfn = function(data){
    return `<sup><a class="wiki_rfn" id="rfn_${data.index}" href="#fn_${data.index}" title="${data.text}">[${data.index}]</a></sup>`
};

Renderer.prototype.footnotes = function(footnotes){
    var result = '<ul class="wiki_fns">';
    footnotes.forEach(function(fn, index){
       result += `<li><a class="wiki_fn" id="fn_${index + 1}" href="#rfn_${index + 1}" title="${fn.text}">[${index + 1}]</a> ${fn.text}</li>`;
    });
    result += "</ul>";
    return result;
};

Renderer.prototype.toc = function(data){
    return ['<sup><a class="footnote_content" id="rfn_'+data.index+'" href="#fn_'+data.index+'" title="'+data.text+'"></a></sup>'
        , '<a id="fn_'+data.index+'" href="#rfn_'+data.index+'">['+data.index+']</a> '+data.text];
};

Renderer.prototype.assemble = function(content, toc, footnotes){
    return toc+content+footnotes;
};

Renderer.prototype.paragraph = function(data){
    return '<p>'+data.text+'</p>';
};

Renderer.prototype.emptyline = function(data){
    return '<br />';
};

Renderer.prototype.list = function(list){
    console.log(list);
    var content = '',
        curOrdered = list[0].ordered,
        curLevel = list[0].level;
    if(curOrdered){
        content = '<ol>';
    } else{
        content = '<ul>';
    }

    while(list[0]) {
        if(list[0].level == curLevel)
            content += `<li>${list.shift().text}`;
        else if(list[0].level > curLevel){
            content += `${this.list(list)}`;
        } else{
            break;
        }
        content += '</li>';
    }

    if (curOrdered) {
        content += '</ol>';
    } else {
        content += '</ul>';
    }
    return content;
};

module.exports = Renderer;