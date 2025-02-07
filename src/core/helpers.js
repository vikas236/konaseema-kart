function camelCasing(arr) {
  const result = [];

  arr.forEach((e) => {
    result.push(e[0].toUpperCase() + e.slice(1, e.length));
  });
}

export default camelCasing;
