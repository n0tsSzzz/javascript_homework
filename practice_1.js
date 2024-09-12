//1

function isPrime(num) {
  for (let i = 2; i < num; i++) {
    if (num % i === 0) return false;
  }

  return num !== 1;
}

for (let i = 2; i < 20; i++) {
  console.log(isPrime(i));
}

//2

function findMinMax(arr) {
  let min_arr = arr[0];
  let max_arr = arr[0];
  
  for (let i = 1; i < arr.length; i++) { 
    if (arr[i] > max_arr) { 
      max_arr = arr[i]; 
    }
    if (arr[i] < min_arr) { 
      min_arr = arr[i];
    }
  }
  
  return [min_arr, max_arr]; 
}

var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(findMinMax(array));

//3

const user = {
  name: "Marko",
  age: 18,
  email: "123@mail.ru",
  greet: function() {
        return `Привет, ${this.name}!`
    }
};


console.log(user.greet())
function displayUserInfo(obj) {
  return  (`name: ${obj.name}, age: ${obj.age}, email: ${obj.email}`)
}

console.log(displayUserInfo(user));

//4

var arr = ["Анна", "Иван", "Мария", "Алексей", "Екатерина"]
for (let i = 0; i < arr.length; i++) {
    console.log(`Студент ${arr[i]}, ваш порядковый номер: ${i}`);
}

function findLongestName(arr) {
    let longestname = ''
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].length > longestname.length) {
            longestname = arr[i]
        }
    }
    return longestname;
}

console.log(findLongestName(arr));

//5

const today = new Date(Date.now());

function formatDate(date) {
	return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

console.log(formatDate(today));

function getDifference(date1, date2) {
	return Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));
}


console.log(getDifference(today, new Date("6/9/2024")));

//6

function reverseString(string) {
    let res = '';
    for (let i = string.length - 1; i > -1; i--) {
        res = res + string[i]
    }
    return res;
}

console.log(reverseString('лотс'))


//7

function removeVowels(string) {
	return string.replace(/[aeioyuAEIOYU]/g, "");
}

console.log(removeVowels("hi my name is marko"));
