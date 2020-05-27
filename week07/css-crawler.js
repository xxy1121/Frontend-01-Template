let tr_list = document.getElementById("container").children;
let result = [];

for(let item of tr_list) {
  if(item.getAttribute("data-tag").match(/css/)) {
    result.push({
      name: item.children[1].innerText,
      url: item.children[1].children[0].href
    });
  }
}

console.log(result);