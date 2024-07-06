let a = 10;
const person1 = {
  name: "kamal",
  age: 30,
  friends: ["Shola", "Ade", "Ibraheem"],
  greet: function () {
    alert("Hello World");
  },
};
person1.isAdmin = true;
person1.name = "lawal";
const userName = "level";
let person2 = {
  "first name": "kamal",
  age: 30,
  [userName]: "see",
};
console.log(person2);
