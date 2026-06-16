let compareByAuthorPrice = (a, b) => {
    if (a.author < b.author) return -1;
    if (a.author > b.author) return 1;
    
    if (a.price < b.price) return -1;
    if (a.price > b.price) return 1;
};

d3.select("table")
  .select("tbody")
  .selectAll("tr")
  .sort(compareByAuthorPrice);
