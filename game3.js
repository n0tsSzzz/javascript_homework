let player = {
    name: 'Исследователь',
    health: 100,
    inventory: [],
    location: 'start'
};

const locations = {
    start: {
        name: 'Начальная деревня',
        description: 'Тихая деревня, окруженная густым лесом.',
        choices: [
            { text: 'Пойти в лес', nextLocation: 'forest' },
            { text: 'Заглянуть на рынок', nextLocation: 'market' },
            { text: 'Выйти из игры', event: 'exit' }
        ]
    },
    forest: {
        name: 'Темный лес',
        description: 'Опасный лес, полный загадок и сокровищ.',
        choices: [
            { text: 'Искать ягоды', event: 'findBerries' },
            { text: 'Углубиться в лес', nextLocation: 'deepForest' },
            { text: 'Вернуться в начало', nextLocation: 'start'},
            { text: 'Выйти из игры', event: 'exit' }
        ]
    },
    market: {
        name: 'Рынок',
        description: 'Оживленный рынок с множеством товаров.',
        choices: [
            { text: 'Купить зелье здоровья', event: 'buyHealthPotion' },
            { text: 'Поговорить с торговцем', event: 'talkToMerchant' },
            { text: 'Вернуться в начало', nextLocation: 'start'},
            { text: 'Выйти из игры', event: 'exit' }
        ]
    },
    deepForest: {
        name: 'Глубь леса',
        description: 'Густой лес, где обитают опасные существа.',
        choices: [
            { text: 'Сразиться с монстром', event: 'fightMonster' },
            { text: 'Использовать зелье', event: 'useHealthPotion' },
            { text: 'Вернуться назад', nextLocation: 'forest' },
            { text: 'Выйти из игры', event: 'exit' }
        ]
    }
};

async function showLocation() {
    const location = locations[player.location];
    console.log(`\nВы находитесь в: '${location.name}'`);
    console.log(location.description);
    console.log('Что вы хотите сделать?');
    location.choices.forEach((choice, index) => {
        console.log(`${index + 1}. ${choice.text}`);
    });
    process.stdout.write('> ');
}

async function makeChoice(choiceIndex) {
    const location = locations[player.location];
    if (choiceIndex < 1 || choiceIndex > location.choices.length) {
        console.log('Неверный выбор. Попробуйте еще раз.');
        await showLocation();
        return;
    }
    const choice = location.choices[choiceIndex - 1];

    if (choice.nextLocation) {
        await moveToLocation(choice.nextLocation);
    } else if (choice.event) {
        await handleEvent(choice.event);
    }
}

async function moveToLocation(nextLocation) {
    console.log(`\nВы направляетесь в '${locations[nextLocation].name}'...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    player.location = nextLocation;
    await showLocation();
}

async function handleEvent(eventName) {
    switch (eventName) {
        case 'findBerries':
            await findBerries();
            break;
        case 'buyHealthPotion':
            await buyHealthPotion();
            break;
        case 'talkToMerchant':
            await talkToMerchant();
            break;
        case 'fightMonster':
            await fightMonster();
            break;
        case 'useHealthPotion':
            await useHealthPotion();
            break;
        case 'exit':
            console.log('Заходите еще!')
            process.exit(0);
        default:
            console.log('Событие не найдено.');
            await showLocation();
    }
}

async function findBerries() {
    console.log('\nВы ищете ягоды...');
    const found = await new Promise(resolve => {
        setTimeout(() => {
            resolve(Math.random() > 0.5);
        }, 1500);
    });

    if (found) {
        console.log('Вы нашли лечебные ягоды и восстановили 20 здоровья!');
        player.health = Math.min(player.health + 20, 100);
    } else {
        console.log('Вы не нашли ничего полезного.');
    }
    
    await showPlayerStatus();
    await showLocation();
}



async function buyHealthPotion() {
    console.log('\nВы пытаетесь купить зелье здоровья...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!player.inventory.includes('Сокровище')) {
        console.log('Недостаточно средств (Цена зелья - одно сокровище)');
        await showPlayerStatus();
        await showLocation();
        return
    }
    player.inventory.splice(player.inventory.indexOf('Сокровище'), 1)
    player.inventory.push('Зелье здоровья');
    console.log('Вы купили зелье здоровья!');
    
    await showPlayerStatus();
    await showLocation();
}


async function talkToMerchant() {
    console.log('\nВы начинаете разговор с торговцем...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (!player.inventory.includes('Редкий артефакт')) {
        console.log('Торговец предлагает вам редкий артефакт!');
        player.inventory.push('Редкий артефакт');
        console.log('Вы получили редкий артефакт!');
    } else {
        console.log('У вас уже есть редкий артефакт');
    }
    
    await checkForEnding();
}

async function fightMonster() {
    console.log('\nВы вступаете в сражение с монстром...');
    
    const won = await new Promise(resolve => {
        setTimeout(() => {
            resolve(Math.random() > 0.5);
        }, 2000);
    });

    if (won) {
        console.log('Вы победили монстра и нашли сокровище!');
        
        player.inventory.push('Сокровище');
        
        if (player.inventory.filter(item => item === 'Сокровище').length >= 10) {
            console.log('Вы собрали 10 сокровищ! Игра окончена.');
            await gameOver('secret');
        } else {
            await checkForEnding();
        }
        
    } else {
        console.log('Монстр победил вас. Вы потеряли 50 здоровья.');
        
        player.health -= 50;
        
        if (player.health <= 0) {
            console.log('Вы погибли в бою...');
            await gameOver('defeat');
        } else {
            await showPlayerStatus();
            await showLocation();
        }
    }
}

async function useHealthPotion() {
    if (player.inventory.includes('Зелье здоровья')) {
        const index = player.inventory.indexOf('Зелье здоровья');
        
        player.inventory.splice(index, 1);
        
        player.health = Math.min(player.health + 20, 100);
        
        console.log('\nВы восстановили часть здоровья!');
        
    } else {
        console.log('\nУ вас нет зелья!');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await showPlayerStatus();
    await showLocation();
}

async function checkForEnding() {
    if (player.inventory.includes('Сокровище') && player.inventory.includes('Редкий артефакт')) {
        await gameOver('victory');
        
    } else {
        await showPlayerStatus();
        await showLocation();
    }
}

async function gameOver(type) {
   if (type === 'victory') {
       console.log('\nПоздравляем! Вы успешно завершили путешествие и нашли все сокровища!');
       await new Promise(resolve => setTimeout(resolve, 1000));
       process.exit(0);
   } else if (type === 'defeat') {
       console.log('\nК сожалению, вы потерпели поражение. Попробуйте снова!');
       await new Promise(resolve => setTimeout(resolve, 1000));
       process.exit(0);
   } else if (type === 'secret') {
       console.log('\nВы достигли неожиданной концовки. Спасибо за игру!');
       await new Promise(resolve => setTimeout(resolve, 1000));
       process.exit(0);
   }
}

async function showPlayerStatus() {
   console.log(`\nСтатус игрока:`);
   console.log(`Здоровье: ${player.health}`);
   console.log(`Инвентарь: ${player.inventory.join(', ') || 'Пусто'}`);
}

const readline = require('readline');

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});



async function startGame() {
    console.log('Добро пожаловать в "Мир путешествий"!');
    await showPlayerStatus();
    await showLocation();
     
    rl.on('line', async (input) => {
        const choice = parseInt(input);
        if (!isNaN(choice)) {
            await makeChoice(choice);
        } else {
            console.log('Пожалуйста, введите номер вашего выбора.');
        }
    });
 }
 
 startGame();
 