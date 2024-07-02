var {parseEvents, parseEvent, parseTicks, parseHeader, parsePlayerInfo} = require('@laihoe/demoparser2');

const filePath = "demos/[-------------NAME OF YOUR DEMO HERE------------].dem"

console.log(``)
console.log(`-- Utility waste analysis --`)
console.log(`> MAP: ${parseHeader(filePath).map_name}`)

const he = {nome:'High Explosive Grenade',valor:300}
const smoke = {nome:'Smoke Grenade',valor:300}
const bang = {nome:'Flashbang',valor:200}
const molotov = {nome:'Molotov',valor:400}
const molotov_ct = {nome:'Incendiary Grenade',valor:600}
const decoy = {nome:'Decoy Grenade',valor:50}

const propsAnalise = ["team_name","current_equip_value", "total_rounds_played", "inventory", "cash_spent_this_round", "weapon_purchases_this_round", "round_start_equip_value", "money_saved_total", "health", "kills_total", "deaths_total"]
const eventBuyTimeEnded = 'round_freeze_end'
const eventRoundStart = 'round_poststart'
const eventRoundEnd = 'rank_update'
const players = parsePlayerInfo(filePath).map(x => x.name)

let eventsStart = parseEvent(filePath, eventRoundStart)
let wantedTicksStart = eventsStart.map(event => event.tick)
let tickDataStart = parseTicks(filePath, propsAnalise, wantedTicksStart)

let eventsComprou = parseEvent(filePath, eventBuyTimeEnded)
let wantedTicksComprou = eventsComprou.map(event => event.tick)
let tickDataComprou = parseTicks(filePath, propsAnalise, wantedTicksComprou)

const eventNames = ["player_death"];
let deathEvents = parseEvents(filePath, eventNames,["game_time","team_num"]);
const matchStartTick = deathEvents.find(event => event.event_name === "begin_new_match")?.tick || 0;
deathEvents = deathEvents.filter(event => event.tick >= matchStartTick);
const ticksDataMorreram = []
for(const player of players) {
    let wantedTicksMorreu = deathEvents.filter(x => x.user_name == player).map(x => x.tick - 5)
    let tickDataMorreu = parseTicks(filePath, propsAnalise, wantedTicksMorreu)
    ticksDataMorreram.push({
        playerName: player,
        data: tickDataMorreu
    })
}

let eventsRoundEnd = parseEvent(filePath, eventRoundEnd)
let wantedTicksRoundEnd = eventsRoundEnd.map(event => event.tick)
let tickDataRoundEnd = parseTicks(filePath, propsAnalise, wantedTicksRoundEnd)

let maxRound = Math.max(...tickDataComprou.map(t => t.total_rounds_played))
console.log(`> Rounds  : ${maxRound+1}`)
console.log(``)
console.log(`     player       |        k/d       |    total spent   |    total wasted   `)
console.log(`----------------------------------------------------------------------------`)

const resultados = []
for (const player of players) {
    const tickDataMorreu = ticksDataMorreram.filter(x => x.playerName == player).map(x => x.data)[0]
    let totalGastoGeral = 0
    let totalDesperdicadoGeral = 0
    let kills = tickDataRoundEnd.filter(t => t.name == player)[0].kills_total
    let deaths = tickDataRoundEnd.filter(t => t.name == player)[0].deaths_total

    for (let round = 0; round < maxRound + 1; round++){
        const playersThisRoundComprou = tickDataComprou.filter(t => t.total_rounds_played == round)
        const playersThisRoundInicio = tickDataStart.filter(t => t.total_rounds_played == round)
        const playersThisRoundMorte = tickDataMorreu.filter(t => t.total_rounds_played == round)

        const roundDoPlayerInicio = playersThisRoundInicio.filter(t => t.name == player)[0]
        const roundDoPlayerComprou = playersThisRoundComprou.filter(t => t.name == player)[0]
        const roundDoPlayerMorreu = playersThisRoundMorte.filter(t => t.name == player)[0]

        const totalEco = getSomaUtilitarias(roundDoPlayerInicio)
        const totalGasto = getSomaUtilitarias(roundDoPlayerComprou)
        const totalDesperdicado = getSomaUtilitarias(roundDoPlayerMorreu)

        const result = {
            nome: roundDoPlayerComprou.name,
            totalBombasGasto: totalGasto - totalEco,
            totalBombaDesperdicado: totalDesperdicado
        }

        totalGastoGeral += result.totalBombasGasto
        totalDesperdicadoGeral += result.totalBombaDesperdicado
    }
    resultados.push(
        {
            player: player,
            totalGastoGeral: totalGastoGeral,
            totalDesperdicadoGeral: totalDesperdicadoGeral,
            kills: kills,
            deaths: deaths
        }
    )

    const playerName = `${player.substring(0,18).padEnd(18)}`
    const kdText = `       ${kills}/${deaths}`.padEnd(18)
    const gastoText = `    $ ${totalGastoGeral}`.padEnd(18)
    const desperdicioText = `  $ ${totalDesperdicadoGeral} (${Number((totalDesperdicadoGeral/totalGastoGeral)*100).toFixed(2)}%)`.padEnd(18)
    console.log(`${playerName}|${kdText}|${gastoText}|${desperdicioText}`)
    console.log(`----------------------------------------------------------------------------`)
}

console.log('')

function getSomaUtilitarias(round) {
    if (round) {
        const totalComHe = round.inventory.some(x => x == he.nome) ? he.valor : 0
        const totalComSmoke = round.inventory.some(x => x == smoke.nome) ? smoke.valor : 0
        const totalComBang = round.inventory.some(x => x == bang.nome) ? bang.valor : 0
        const totalComMolo = round.inventory.some(x => x == molotov.nome) ? molotov.valor : 0
        const totalComMoloCt = round.inventory.some(x => x == molotov_ct.nome) ? molotov_ct.valor : 0
        const totalComDecoy = round.inventory.some(x => x == decoy.nome) ? decoy.valor : 0

        return totalComHe + totalComSmoke + totalComBang + totalComMolo + totalComMoloCt + totalComDecoy
    }
    return 0
}