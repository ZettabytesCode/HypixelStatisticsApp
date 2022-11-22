import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity, Image, ScrollView, ActivityIndicator} from 'react-native';
import cio from 'cheerio-without-node-native'
import { color } from 'react-native-reanimated';
import { roundToNearestPixel } from 'react-native/Libraries/Utilities/PixelRatio';
import { out } from 'react-native/Libraries/Animated/src/Easing';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mcAPILink = "https://api.mojang.com/users/profiles/minecraft/";
const hypixelAPILink = "https://api.hypixel.net/player?key=96101314-5254-4acc-bc55-70f2a56b09d5&uuid=";

var ownedMegaWallClasses = [];

function convertExpToLevel(expAmount){
    const val = (Math.sqrt((2 *expAmount) + 30625)/50)-2.5;
    return Math.floor(val)
}

 async function getDataAndValue(displayName){
    let keys = []
    try{
        keys = await AsyncStorage.getAllKeys()
    }catch(error){
        console.log(error)
    }
    return (keys.includes(displayName))
 }


function getRank(jsonresponse){
    let rank = '';

    if (jsonresponse.player.prefix) {
        rank = jsonresponse.player.prefix.replace(/§4|§c|§6|§e|§2|§a|§b|§3|§1|§9|§d|§5|§f|§7|§8|§0|§r|§l|§o|§n|§m|§k|\[|\]/g, '')
        rank = '['+rank+']'
    } else if (jsonresponse.player.rank) { // Check if is ADMIN, MOD, HELPER, YT...
        if(jsonresponse.player.rank === 'YOUTUBER'){
            rank = '[YOUTUBE]'
        }else{
            rank = '[' +jsonresponse.player.rank +']';
        }
    } else if (jsonresponse.player.monthlyPackageRank && jsonresponse.player.monthlyPackageRank !== 'NONE') {     // Check if is MVP++
        rank = '[MVP++]'
    } else if (jsonresponse.player.newPackageRank) { // Check if is VIP...MVP+
        rank = '['+jsonresponse.player.newPackageRank.replace('_PLUS', '+') + ']';
    } else {
        rank = '';
    }
    return rank;
}
const Stats = ({navigation, route}) => {
    
    const [arcadeState, setArcadeState] = React.useState(false);
    const [bedwarsState, setBedwarsState] = React.useState(false);
    const [buildBattleState, setBuildBattleState] = React.useState(false);
    const [bsgState, setBsgState] = React.useState(false); 
    const [copsAndCrimsState, setCopsAndCrimsState] = React.useState(false);
    const [duelsState, setDuelsState] = React.useState(false);
    const [megaWallsState, setMegaWallsState] = React.useState(false);
    const [murderMysteryState, setMurderMysteryState] = React.useState(false);
    const [skywarsState, setSkywarsState] = React.useState(false);
    const [smashHerosState, setSmashHerosState] = React.useState(false);
    const [speedUHCState, setSpeedUHCState] = React.useState(false);
    const [tntGamesState, setTntGamesState] = React.useState(false);
    const [uhcChampionsState, setUhcChampionsState] = React.useState(false);
    const [warlordsState, setWarlordsState] = React.useState(false);
    const [arenaBrawlState, setArenaBrawlState] = React.useState(false);
    const [paintballState, setPaintballState] = React.useState(false);
    const [quakeState, setQuakeState] = React.useState(false);
    const [tkrState, setTKRState] = React.useState(false);
    const [vampirezState, setVampirezState] = React.useState(false);
    const [wallsState, setWallsState] = React.useState(false);

    const [favoriteState, setFavoriteState] = React.useState(false);
    
    useEffect(() => {
        getDataAndValue(route.params.playerJSON.player.displayname).then((value) =>{
            setFavoriteState(value)
        }).catch((error) =>{
            alert("here fail")
        })
    })

    return(
        <View style = {styles.container}>
            <View style = {styles.rectangle}>
                <View style = {styles.randomView}>
                    <TouchableOpacity style = {styles.imageStyling} onPress ={ () => {
                            if(route.params.from === "Favorites"){
                                navigation.push("Favorites")
                            }else{
                                navigation.push("Home")
                            }
                        }}>
                        <Image source = {require('../assets/symbols/chevron-left.png')}
                        resizeMode = 'contain'
                        style={{
                            width:37,
                            height:37,
                            tintColor: "#6B6B6B"
                        }}/>
                    </TouchableOpacity>
                    <Text style = {styles.headerText}>Stats</Text>
                </View>
            </View>
            <ScrollView>
                <View style={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <View style ={styles.weirdStyleThing}>
                            <Text style={styles.cardTextStyle}>{getRank(route.params.playerJSON)}{" "}{route.params.playerJSON.player.displayname}</Text>
                            <TouchableOpacity style = {styles.favoriteStyling} onPress ={ () => {
                                if ( favoriteState ) {
                                    try {
                                            AsyncStorage.removeItem(route.params.playerJSON.player.displayname).then(() => 
                                        console.log(route.params.playerJSON.player.displayname +"removed")
                                        )
                                    }catch(e){
                                        alert(e)
                                    }
                                }else{
                                    try{
                                            AsyncStorage.setItem(route.params.playerJSON.player.displayname, '0').then(() => 
                                            console.log(route.params.playerJSON.player.displayname +"added")
                                    )
                                    }catch(e){
                                        alert(e)
                                    }
                                }
                                setFavoriteState(!favoriteState)
                            }}>
                            <Image source = {require('../assets/symbols/star.png')}
                            resizeMode = 'contain'
                            style={{
                                width:35,
                                height:35,
                                tintColor: favoriteState ? "#F56334" : "#6B6B6B"
                            }}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.cardTextStyleInnerHighlighted}>
                            Level:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{convertExpToLevel(route.params.playerJSON.player.networkExp)}</Text>
                        </Text>
                        <Text style={styles.cardTextStyleInnerHighlighted}>
                            Karma:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{route.params.playerJSON.player.karma}</Text>
                        </Text>
                        <Text style={styles.cardTextStyleInnerHighlighted}>
                            Achievement Points:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{route.params.playerJSON.player.achievementPoints}</Text>
                        </Text>
                        <Text style={styles.cardTextStyleInnerHighlighted}>
                            Quests:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{route.params.playerJSON.player.achievements.general_quest_master}</Text>
                        </Text>
                    </View>
                </View>
                


                <View style ={styles.cardContainerStyling} >
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setArcadeState(!arcadeState)
                }}>
                            <Text style={arcadeState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>Arcade</Text>
                        </TouchableOpacity>
                        {displayArcadeInformation(arcadeState, route.params.playerJSON.player.stats.Arcade)}
                    </View>
                </View>
                
                <View style ={styles.cardContainerStyling} >
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setBedwarsState(!bedwarsState)
                }}>
                            <Text style={bedwarsState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>Bedwars</Text>
                        </TouchableOpacity>
                        {displayBedwarsInformation(bedwarsState, route.params.playerJSON.player.stats.Bedwars, route.params.playerJSON)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling} >
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setBuildBattleState(!buildBattleState)
                }}>
                            <Text style={buildBattleState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>Build Battle</Text>
                        </TouchableOpacity>
                        {displayBuildBattleInformation(buildBattleState, route.params.playerJSON.player.stats.BuildBattle)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setBsgState(!bsgState)
                }}>
                            <Text style={bsgState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>Blitz Survival Games</Text>
                        </TouchableOpacity>
                        {displayBsgInformation(bsgState, route.params.playerJSON.player.stats.HungerGames)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setCopsAndCrimsState(!copsAndCrimsState)
                }}>
                            <Text style={copsAndCrimsState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>Cops and Crims</Text>
                        </TouchableOpacity>
                        {displayCVCInformation(copsAndCrimsState, route.params.playerJSON.player.stats.MCGO)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setDuelsState(!duelsState)
                }}>
                            <Text style={duelsState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>Duels</Text>
                        </TouchableOpacity>
                        {displayDuelsInformation(duelsState, route.params.playerJSON.player.stats.Duels)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setMegaWallsState(!megaWallsState)
                }}>
                            <Text style={megaWallsState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>Mega Walls</Text>
                        </TouchableOpacity>
                        {displayMegaWallsInformation(megaWallsState, route.params.playerJSON.player.stats.Walls3)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setMurderMysteryState(!murderMysteryState)
                }}>
                            <Text style={murderMysteryState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>Murder Mystery</Text>
                        </TouchableOpacity>
                        {displayMMInformation(murderMysteryState, route.params.playerJSON.player.stats.MurderMystery)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setSkywarsState(!skywarsState)
                }}>
                            <Text style={skywarsState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>Skywars</Text>
                        </TouchableOpacity>
                        {displaySkywarsInformation(skywarsState, route.params.playerJSON.player.stats.SkyWars)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setSmashHerosState(!smashHerosState)
                }}>
                            <Text style={smashHerosState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>Smash Heroes</Text>
                        </TouchableOpacity>
                        {displaySmashHerosInformation(smashHerosState, route.params.playerJSON.player.stats.SuperSmash)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setSpeedUHCState(!speedUHCState)
                }}>
                            <Text style={speedUHCState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>Speed UHC</Text>
                        </TouchableOpacity>
                        {displaySpeedUHCInformation(speedUHCState, route.params.playerJSON.player.stats.SpeedUHC)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setTntGamesState(!tntGamesState)
                }}>
                            <Text style={tntGamesState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>TNT Games</Text>
                        </TouchableOpacity>
                        {displayTNTGamesInformation(tntGamesState, route.params.playerJSON.player.stats.TNTGames)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setUhcChampionsState(!uhcChampionsState)
                }}>
                            <Text style={uhcChampionsState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>UHC Champions</Text>
                        </TouchableOpacity>
                        {displayUHCInformation(uhcChampionsState, route.params.playerJSON.player.stats.UHC)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setWarlordsState(!warlordsState)
                }}>
                            <Text style={warlordsState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>Warlords</Text>
                        </TouchableOpacity>
                        {displayWarlordsInformation(warlordsState, route.params.playerJSON.player.stats.Battleground)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setArenaBrawlState(!arenaBrawlState)
                }}>
                            <Text style={arenaBrawlState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>Arena Brawl</Text>
                        </TouchableOpacity>
                        {displayArenaBrawlInformation(arenaBrawlState, route.params.playerJSON.player.stats.Arena)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setPaintballState(!paintballState)
                }}>
                            <Text style={paintballState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>Paintball</Text>
                        </TouchableOpacity>
                        {displayPaintBallInformation(paintballState, route.params.playerJSON.player.stats.Paintball)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setQuakeState(!quakeState)
                }}>
                            <Text style={quakeState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>Quake</Text>
                        </TouchableOpacity>
                        {displayQuakeInformation(quakeState, route.params.playerJSON.player.stats.Quake, route.params.playerJSON.player)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setTKRState(!tkrState)
                }}>
                            <Text style={tkrState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>Turbo Kart Racers</Text>
                        </TouchableOpacity>
                        {displayTKRInformation(tkrState, route.params.playerJSON.player.stats.GingerBread)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setVampirezState(!vampirezState)
                }}>
                            <Text style={vampirezState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>VampireZ</Text>
                        </TouchableOpacity>
                        {displayWarlordsInformation(vampirezState, route.params.playerJSON.player.stats.VampireZ)}
                    </View>
                </View>

                <View style ={styles.cardContainerStyling}>
                    <View style={styles.cardStyling}>
                        <TouchableOpacity onPress={() => {
                    setWallsState(!wallsState)
                }}>
                            <Text style={wallsState ? styles.cardTextStyle : styles.cardTextStyleUnopened}>Walls</Text>
                        </TouchableOpacity>
                        {displayWallsInformation(wallsState, route.params.playerJSON.player.stats.Walls)}
                    </View>
                </View>
                
            </ScrollView>
        </View>
    )
}

function accuracyCalc(hits, total, isPercentForm){
    let pureProb = hits/total;
    if(hits == 0 && total == 0){
        return 0;
    }
    if(isPercentForm){
        let percentForm = (Math.floor(pureProb * 100))
        if(percentForm == NaN){
            return "0%";
        }else if(percentForm == Infinity){
            return hits;
        }else{
            return percentForm + "%";
        }    
    }else{
        let percentForm = (Math.floor(pureProb * 100))
        if(percentForm == NaN){
            return 0;
        }else if(percentForm == Infinity){
            return hits;
        }else{
            return percentForm / 100;
        }    
    }
}

function displayArcadeInformation(arcadeState, playerJSON){
    if(arcadeState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON?.coins || 0)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Blocking Dead Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_dayone)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Dragon Wars Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_dragonwars2)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Bounty Hunters Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_oneinthequiver)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Blocking Dead Headshots:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.headshots_dayone)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Blocking Dead Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_dayone)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Dragon Wars Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_dragonwars2)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Enderspleef Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_ender)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Farm Hunt Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_farm_hunt)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Bounty Hunters Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_oneinthequiver)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Party Games Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_party_3) + validate(playerJSON.wins_party)+ validate(playerJSON.wins_party_2)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Throw Out Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_throw_out)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Hole in the Wall Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_hole_in_the_wall)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>HITW Highest Qualification Score:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.hitw_record_q)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>HITW Highest Finals Score:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.hitw_record_f)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Galaxy Wars Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.sw_kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Galaxy Wars Empire Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.sw_empire_kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Galaxy Wars Rebel Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.sw_rebel_kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Galaxy Wars Deaths:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.sw_deaths)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Galaxy Wars Shots Fired:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.sw_shots_fired)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Galaxy Wars Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.sw_game_wins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Hide and Seek Seeker Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.seeker_wins_hide_and_seek)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Hide and Seek Hider Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.hider_wins_hide_and_seek)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Party Pooper Seeker Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.party_pooper_seeker_wins_hide_and_seek)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Party Pooper Seeker Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.party_pooper_hider_wins_hide_and_seek)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Zombies Accuracy:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.bullets_hit_zombies), validate(playerJSON.bullets_shot_zombies), true)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Zombies Headshot Accuracy:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.headshots_zombies), validate(playerJSON.bullets_hit_zombies), true)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>{" "}</Text>



                <View style = {styles.flexRow}>
                    <View style = {styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Map:</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Dead End</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Bad Blood</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Alien Arcadium</Text>
                    </View>
                    <View style = {styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Downs:</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.times_knocked_down_zombies_deadend)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.times_knocked_down_zombies_badblood)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.times_knocked_down_zombies_alienarcadium)}</Text>
                    </View>
                    <View style = {styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Revives:</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.players_revived_zombies_deadend)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.players_revived_zombies_badblood)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.players_revived_zombies_alienarcadium)}</Text>
                    </View>
                    <View style = {styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Best Round:</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.best_round_zombies_deadend)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.best_round_zombies_badblood)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.best_round_zombies_alienarcadium)}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

function displayBedwarsInformation(bedwarsState, playerJSON, fullPlayerJSON){
    if(bedwarsState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Level:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(fullPlayerJSON.player.achievements.bedwars_level)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Winstreak:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.winstreak)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>{" "}</Text>
                <View style= {styles.flexRow}> 
                    <View style = {styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Mode:</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Solo:</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Doubles:</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>3v3v3v3:</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>4v4v4v4:</Text>     
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Core:</Text>   
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>FKs:</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.eight_one_final_kills_bedwars)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.eight_two_final_kills_bedwars)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.four_three_final_kills_bedwars)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.four_four_final_kills_bedwars)}</Text>   
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.four_four_final_kills_bedwars) + validate(playerJSON.eight_one_final_kills_bedwars) + validate(playerJSON.eight_two_final_kills_bedwars) + validate(playerJSON.four_three_final_kills_bedwars)}</Text>   
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>FKDR:</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.eight_one_final_kills_bedwars), validate(playerJSON.eight_one_final_deaths_bedwars), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.eight_two_final_kills_bedwars), validate(playerJSON.eight_two_final_deaths_bedwars), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.four_three_final_kills_bedwars), validate(playerJSON.four_three_final_deaths_bedwars), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.four_four_final_kills_bedwars), validate(playerJSON.four_four_final_deaths_bedwars), false)}</Text>  
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.four_four_final_kills_bedwars) + validate(playerJSON.eight_one_final_kills_bedwars) + validate(playerJSON.eight_two_final_kills_bedwars) + validate(playerJSON.four_three_final_kills_bedwars), validate(playerJSON.four_four_final_deaths_bedwars) + validate(playerJSON.eight_one_final_deaths_bedwars) + validate(playerJSON.eight_two_final_deaths_bedwars) + validate(playerJSON.four_three_final_deaths_bedwars), false)}</Text>   
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Wins:</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.eight_one_wins_bedwars)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.eight_two_wins_bedwars)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.four_three_wins_bedwars)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.four_four_wins_bedwars)}</Text>   
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.eight_one_wins_bedwars)+validate(playerJSON.eight_two_wins_bedwars)+validate(playerJSON.four_three_wins_bedwars)+validate(playerJSON.four_four_wins_bedwars)}</Text>   
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>W/L:</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.eight_one_wins_bedwars), validate(playerJSON.eight_one_losses_bedwars), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.eight_two_wins_bedwars), validate(playerJSON.eight_two_losses_bedwars), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.four_three_wins_bedwars), validate(playerJSON.four_three_losses_bedwars), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.four_four_wins_bedwars), validate(playerJSON.four_four_losses_bedwars), false)}</Text>   
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.eight_one_wins_bedwars)+validate(playerJSON.eight_two_wins_bedwars)+validate(playerJSON.four_three_wins_bedwars)+validate(playerJSON.four_four_wins_bedwars), validate(playerJSON.eight_one_losses_bedwars)+validate(playerJSON.eight_two_losses_bedwars)+validate(playerJSON.four_three_losses_bedwars)+validate(playerJSON.four_four_losses_bedwars), false)}</Text>     
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Beds:</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.eight_one_beds_broken_bedwars)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.eight_two_beds_broken_bedwars)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.four_three_beds_broken_bedwars)}</Text>   
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.four_four_beds_broken_bedwars)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.eight_one_beds_broken_bedwars)+validate(playerJSON.eight_two_beds_broken_bedwars)+validate(playerJSON.four_three_beds_broken_bedwars)+validate(playerJSON.four_four_beds_broken_bedwars)}</Text>     
                    </View>
                </View>
            </View>
        );
    }
}

function displayBuildBattleInformation(buildBattleState, playerJSON){
    if(buildBattleState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Score:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.score)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Solo Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_solo_normal)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Teams Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_teams_normal)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Guess the Build Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_guess_the_build)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Pro Mode Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_solo_pro)}</Text></Text>

            </View>
        );
    }
}

function displayBsgInformation(bsgState, playerJSON){
    if(bsgState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Deaths:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.deaths)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Wins Solo:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Wins Teams:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_teams)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kill/Death:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills), validate(playerJSON.deaths), false)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>{" "}</Text>
                <View style ={styles.flexRow}>
                    <View style ={styles.tableViewStyle}>
                    <Text style ={styles.cardTextStyleInnerHighlighted}>Kit</Text>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.horsetamer, "horsetamer", "Horsetamer")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.exp_ranger, "ranger", "Ranger")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.archer, "archer", "Archer")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.astronaut, "astronaut", "Astronaut")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.troll, "troll", "Troll")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.meatmaster, "meatmaster", "Meatmaster")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.reaper, "reaper", "Reaper")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.reddragon, "reddragon", "Reddragon")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.toxicologist, "toxicologist", "Toxicologist")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.exp_donkeytamer, "donkeytamer", "Donkeytamer")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.rogue, "rogue", "Rogue")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.warlock, "warlock", "Warlock")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.slimeyslime, "slimeyslime", "Slimeyslime")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.jockey, "jockey", "Jockey")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.golem, "golem", "Golem")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.viking, "viking", "Viking")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.speleologist, "speleologist", "Speleologist")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON["shadow knight"], "shadow knight", "Shadow Knight")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.baker, "baker", "Baker")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.knight, "knight", "Knight")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.pigman, "pigman", "Pigman")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.guardian, "guardian", "Guardian")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.exp_phoenix, "phoenix", "Phoenix")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.paladin, "paladin", "Paladin")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.necromancer, "necromancer", "Necromancer")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.scout, "scout", "Scout")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.hunter, "hunter", "Hunter")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.exp_warrior, "warrior", "Warrior")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON["hype train"], "hype train", "Hype Train")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.fisherman, "fisherman", "Fisherman")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.florist, "florist", "Florist")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.diver, "diver", "Diver")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.arachnologist, "arachnologist", "Arachnologist")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.blaze, "blaze", "Blaze")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.wolftamer, "wolftamer", "Wolftamer")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.tim, "tim", "Tim")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.snowman, "snowman", "Snowman")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.farmer, "farmer", "Farmer")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.armorer, "armorer", "Armorer")}</View>
                        <View>{validateBSGKit(playerJSON.packages, playerJSON.creepertamer, "creepertamer", "Creepertamer")}</View>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Rambo</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Level</Text>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.horsetamer, "horsetamer")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.exp_ranger, "ranger")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.archer, "archer")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.astronaut, "astronaut")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.troll, "troll")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.meatmaster, "meatmaster")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.reaper, "reaper")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.reddragon, "reddragon")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.toxicologist, "toxicologist")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.exp_donkeytamer, "donkeytamer")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.rogue, "rogue")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.warlock, "warlock")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.slimeyslime, "slimeyslime")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.jockey, "jockey")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.golem, "golem")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.viking, "viking")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.speleologist, "speleologist")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON["shadow knight"], "shadow knight")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.baker, "baker")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.knight, "knight")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.pigman, "pigman")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.guardian, "guardian")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.exp_phoenix, "phoenix")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.paladin, "paladin")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.necromancer, "necromancer")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.scout, "scout")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.hunter, "hunter")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.exp_warrior, "warrior")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON["hype train"], "hype train")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.fisherman, "fisherman")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.florist, "florist")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.diver, "diver")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.arachnologist, "arachnologist")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.blaze, "blaze")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.wolftamer, "wolftamer")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.tim, "tim")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.snowman, "snowman")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.farmer, "farmer")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.armorer, "armorer")}</View>
                        <View>{validateBSGLevel(playerJSON.packages, playerJSON.creepertamer, "creepertamer")}</View>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" - "}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Prestige</Text>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.horsetamer, "horsetamer")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.exp_ranger, "ranger")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.archer, "archer")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.astronaut, "astronaut")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.troll, "troll")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.meatmaster, "meatmaster")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.reaper, "reaper")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.reddragon, "reddragon")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.toxicologist, "toxicologist")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.exp_donkeytamer, "donkeytamer")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.rogue, "rogue")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.warlock, "warlock")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.slimeyslime, "slimeyslime")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.jockey, "jockey")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.golem, "golem")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.viking, "viking")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.speleologist, "speleologist")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON["shadow knight"], "shadow knight")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.baker, "baker")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.knight, "knight")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.pigman, "pigman")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.guardian, "guardian")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.exp_phoenix, "phoenix")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.paladin, "paladin")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.necromancer, "necromancer")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.scout, "scout")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.hunter, "hunter")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.exp_warrior, "warrior")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON["hype train"], "hype train")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.fisherman, "fisherman")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.florist, "florist")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.diver, "diver")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.arachnologist, "arachnologist")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.blaze, "blaze")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.wolftamer, "wolftamer")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.tim, "tim")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.snowman, "snowman")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.farmer, "farmer")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.armorer, "armorer")}</View>
                        <View>{validateBSGPrestige(playerJSON.packages, playerJSON.creepertamer, "creepertamer")}</View>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" - "}</Text>

                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Wins</Text>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.horsetamer, "horsetamer", playerJSON.wins_horsetamer, playerJSON.wins_teams_horsetamer)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.exp_ranger, "ranger", playerJSON.wins_ranger, playerJSON.wins_teams_ranger)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.archer, "archer", playerJSON.wins_archer, playerJSON.wins_teams_archer)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.astronaut, "astronaut", playerJSON.wins_astronaut, playerJSON.wins_teams_astronaut)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.troll, "troll", playerJSON.wins_troll, playerJSON.wins_teams_troll)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.meatmaster, "meatmaster", playerJSON.wins_meatmaster, playerJSON.wins_teams_meatmaster)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.reaper, "reaper", playerJSON.wins_reaper, playerJSON.wins_teams_reaper)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.reddragon, "reddragon", playerJSON.wins_reddragon, playerJSON.wins_teams_reddragon)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.toxicologist, "toxicologist", playerJSON.wins_toxicologist, playerJSON.wins_teams_toxicologist)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.exp_donkeytamer, "donkeytamer", playerJSON.wins_donkeytamer, playerJSON.wins_teams_donkeytamer)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.rogue, "rogue", playerJSON.wins_rogue, playerJSON.wins_teams_rogue)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.warlock, "warlock", playerJSON.wins_warlock, playerJSON.wins_teams_warlock)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.slimeyslime, "slimeyslime", playerJSON.wins_slimeyslime, playerJSON.wins_teams_slimeyslime)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.jockey, "jockey", playerJSON.wins_jockey, playerJSON.wins_teams_jockey)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.golem, "golem", playerJSON.wins_golem, playerJSON.wins_teams_golem)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.viking, "viking", playerJSON.wins_viking, playerJSON.wins_teams_viking)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.speleologist, "speleologist", playerJSON.wins_speleologist, playerJSON.wins_teams_speleologist)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON["shadow knight"], "shadow knight", playerJSON["wins_shadow knight"], playerJSON["wins_teams_shadow knight"])}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.baker, "baker", playerJSON.wins_baker, playerJSON.wins_teams_baker)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.knight, "knight", playerJSON.wins_knight, playerJSON.wins_teams_knight)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.pigman, "pigman", playerJSON.wins_pigman, playerJSON.wins_teams_pigman)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.guardian, "guardian", playerJSON.wins_guardian, playerJSON.wins_teams_guardian)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.exp_phoenix, "phoenix", playerJSON.wins_phoenix, playerJSON.wins_teams_phoenix)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.paladin, "paladin", playerJSON.wins_paladin, playerJSON.wins_teams_paladin)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.necromancer, "necromancer", playerJSON.wins_necromancer, playerJSON.wins_teams_necromancer)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.scout, "scout", playerJSON.wins_scout, playerJSON.wins_teams_scout)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.hunter, "hunter", playerJSON.wins_hunter, playerJSON.wins_teams_hunter)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.exp_warrior, "warrior", playerJSON.wins_warrior, playerJSON.wins_teams_warrior)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON["hype train"], "hype train", playerJSON["wins_hype train"], playerJSON["wins_teams_hype train"])}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.fisherman, "fisherman", playerJSON.wins_fisherman, playerJSON.wins_teams_fisherman)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.florist, "florist", playerJSON.wins_florist, playerJSON.wins_teams_florist)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.diver, "diver", playerJSON.wins_diver, playerJSON.wins_teams_diver)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.arachnologist, "arachnologist", playerJSON.wins_arachnologist, playerJSON.wins_teams_arachnologist)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.blaze, "blaze", playerJSON.wins_blaze, playerJSON.wins_teams_blaze)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.wolftamer, "wolftamer", playerJSON.wins_wolftamer, playerJSON.wins_teams_wolftamer)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.tim, "tim", playerJSON.wins_tim, playerJSON.wins_teams_tim)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.snowman, "snowman", playerJSON.wins_snowman, playerJSON.wins_teams_snowman)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.farmer, "farmer", playerJSON.wins_farmer, playerJSON.wins_teams_farmer)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.armorer, "armorer", playerJSON.wins_armorer, playerJSON.wins_teams_armorer)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.creepertamer, "creepertamer", playerJSON.wins_creepertamer, playerJSON.wins_teams_creepertamer)}</View>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_rambo) + validate(playerJSON.wins_teams_rambo)}</Text>   
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Kills</Text>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.horsetamer, "horsetamer", playerJSON.kills_horsetamer)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.exp_ranger, "ranger", playerJSON.kills_ranger)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.archer, "archer", playerJSON.kills_archer)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.astronaut, "astronaut", playerJSON.kills_astronaut)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.troll, "troll", playerJSON.kills_troll)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.meatmaster, "meatmaster", playerJSON.kills_meatmaster)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.reaper, "reaper", playerJSON.kills_reaper)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.reddragon, "reddragon", playerJSON.kills_reddragon)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.toxicologist, "toxicologist", playerJSON.kills_toxicologist)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.exp_donkeytamer, "donkeytamer", playerJSON.kills_donkeytamer)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.rogue, "rogue", playerJSON.kills_rogue)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.warlock, "warlock", playerJSON.kills_warlock)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.slimeyslime, "slimeyslime", playerJSON.kills_slimeyslime)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.jockey, "jockey", playerJSON.kills_jockey)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.golem, "golem", playerJSON.kills_golem)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.viking, "viking", playerJSON.kills_viking)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.speleologist, "speleologist", playerJSON.kills_speleologist)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON["shadow knight"], "shadow knight", playerJSON["kills_shadow knight"])}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.baker, "baker", playerJSON.kills_baker)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.knight, "knight", playerJSON.kills_knight)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.pigman, "pigman", playerJSON.kills_pigman)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.guardian, "guardian", playerJSON.kills_guardian)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.exp_phoenix, "phoenix", playerJSON.kills_phoenix)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.paladin, "paladin", playerJSON.kills_paladin)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.necromancer, "necromancer", playerJSON.kills_necromancer)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.scout, "scout", playerJSON.kills_scout)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.hunter, "hunter", playerJSON.kills_hunter)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.exp_warrior, "warrior", playerJSON.kills_warrior)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON["hype train"], "hype train", playerJSON["kills_hype train"])}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.fisherman, "fisherman", playerJSON.kills_fisherman)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.florist, "florist", playerJSON.kills_florist)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.diver, "diver", playerJSON.kills_diver)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.arachnologist, "arachnologist", playerJSON.kills_arachnologist)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.blaze, "blaze", playerJSON.kills_blaze)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.wolftamer, "wolftamer", playerJSON.kills_wolftamer)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.tim, "tim", playerJSON.kills_tim)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.snowman, "snowman", playerJSON.kills_snowman)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.farmer, "farmer", playerJSON.kills_farmer)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.armorer, "armorer", playerJSON.kills_armorer)}</View>
                        <View>{validateBSGStats(playerJSON.packages, playerJSON.creepertamer, "creepertamer", playerJSON.kills_creepertamer)}</View>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_rambo)}</Text>   
                    </View>
                </View>
            </View>
        );
    }
}

function displayCVCInformation(cvcState, playerJSON){
    if(cvcState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Headshots:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.headshot_kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Deaths:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.deaths)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Game Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.game_wins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Round Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.round_wins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Shots Fired:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.shots_fired)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Cop Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.cop_kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Criminal Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.criminal_kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Deathmatch Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_deathmatch)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Bombs Planted:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bombs_planted)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Bombs Diffused:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bombs_diffused)}</Text></Text>

            </View>
        )
    }
}

function displayDuelsInformation(duelsState, playerJSON){
    if(duelsState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Deaths:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.deaths)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kill/Death Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills), validate(playerJSON.deaths), false)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Losses:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.losses)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Win/Loss Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins), validate(playerJSON.losses), false)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Arrows Shot:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bow_shots)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Arrows Hit:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bow_hits)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Arrow Hit/Miss Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.bow_hits), validate(playerJSON.bow_shots), false)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Melee Swings:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.melee_swings)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Melee Hits:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.melee_hits)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Melee Hit/Miss Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.melee_hits), validate(playerJSON.melee_swings), false)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <View style ={styles.flexRow}>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Mode:</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>SW Tourney</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Sumo Tourney</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>UHC Tourney</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>UHC 1v1</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>UHC 2v2</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>UHC 4v4</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>UHC Meetup</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>OP 1v1</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Skywars 1v1</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Bow 1v1</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Blitz 1v1</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Sumo 1v1</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Classic 1v1</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>NoDebuff 1v1</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Combo 1v1</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Bridge 1v1</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Bridge 2v2</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Bridge Teams</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Bridge 2v2v2v2</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Bridge 3v3v3v3</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Kills</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.sw_tournament_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.sumo_tournament_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.uhc_tournament_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.uhc_duel_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.uhc_doubles_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.uhc_four_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.uhc_meetup_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.op_duel_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.sw_duel_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bow_duel_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.blitz_duel_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.sumo_duel_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.classic_duel_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.potion_duel_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.combo_duel_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bridge_duel_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bridge_doubles_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bridge_four_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bridge_2v2v2v2_kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bridge_3v3v3v3_kills)}</Text>


                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>K/D</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.sw_tournament_kills), validate(playerJSON.sw_tournament_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.sumo_tournament_kills), validate(playerJSON.sumo_tournament_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.uhc_tournament_kills), validate(playerJSON.uhc_tournament_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.uhc_duel_kills), validate(playerJSON.uhc_duel_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.uhc_doubles_kills), validate(playerJSON.uhc_doubles_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.uhc_four_kills), validate(playerJSON.uhc_four_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.uhc_meetup_kills), validate(playerJSON.uhc_meetup_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.op_duel_kills), validate(playerJSON.op_duel_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.sw_duel_kills), validate(playerJSON.sw_duel_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.bow_duel_kills), validate(playerJSON.bow_duel_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.blitz_duel_kills), validate(playerJSON.blitz_duel_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.sumo_duel_kills), validate(playerJSON.sumo_duel_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.classic_duel_kills), validate(playerJSON.classic_duel_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.potion_duel_kills), validate(playerJSON.potion_duel_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.combo_duel_kills), validate(playerJSON.combo_duel_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.bridge_duel_kills), validate(playerJSON.bridge_duel_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.bridge_doubles_kills), validate(playerJSON.bridge_doubles_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.bridge_four_kills), validate(playerJSON.bridge_four_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.bridge_2v2v2v2_kills), validate(playerJSON.bridge_2v2v2v2_deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.bridge_3v3v3v3_kills), validate(playerJSON.bridge_3v3v3v3_deaths), false)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Wins</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.sw_tournament_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.sumo_tournament_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.uhc_tournament_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.uhc_duel_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.uhc_doubles_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.uhc_four_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.uhc_meetup_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.op_duel_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.sw_duel_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bow_duel_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.blitz_duel_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.sumo_duel_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.classic_duel_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.potion_duel_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.combo_duel_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bridge_duel_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bridge_doubles_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bridge_four_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bridge_2v2v2v2_wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bridge_3v3v3v3_wins)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>W/L</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.sw_tournament_wins), validate(playerJSON.sw_tournament_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.sumo_tournament_wins), validate(playerJSON.sumo_tournament_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.uhc_tournament_wins), validate(playerJSON.uhc_tournament_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.uhc_duel_wins), validate(playerJSON.uhc_duel_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.uhc_doubles_wins), validate(playerJSON.uhc_doubles_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.uhc_four_wins), validate(playerJSON.uhc_four_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.uhc_meetup_wins), validate(playerJSON.uhc_meetup_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.op_duel_wins), validate(playerJSON.op_duel_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.sw_duel_wins), validate(playerJSON.sw_duel_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.bow_duel_wins), validate(playerJSON.bow_duel_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.blitz_duel_wins), validate(playerJSON.blitz_duel_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.sumo_duel_wins), validate(playerJSON.sumo_duel_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.classic_duel_wins), validate(playerJSON.classic_duel_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.potion_duel_wins), validate(playerJSON.potion_duel_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.combo_duel_wins), validate(playerJSON.combo_duel_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.bridge_duel_wins), validate(playerJSON.bridge_duel_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.bridge_doubles_wins), validate(playerJSON.bridge_doubles_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.bridge_four_wins), validate(playerJSON.bridge_four_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.bridge_2v2v2v2_wins), validate(playerJSON.bridge_2v2v2v2_losses), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.bridge_3v3v3v3_wins), validate(playerJSON.bridge_3v3v3v3_losses), false)}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

function displayMegaWallsInformation(megaWallsState, playerJSON){
    if(megaWallsState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Assists:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.assists)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Deaths:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.deaths)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Final Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.finalKills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Final Assists:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.finalAssists)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Final Deaths:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.finalDeaths)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Losses:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.losses)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kill/Death ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills), validate(playerJSON.deaths), false)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Final Kill/Final Death Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.finalKills), validate(playerJSON.finalDeaths), false)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Win/Loss Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins), validate(playerJSON.losses), false)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Wither Damage:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.witherDamage)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Defending Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.defender_kills_standard)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <View style ={styles.flexRow}>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Class</Text>
                        <View>{getMegaWallsClasses(playerJSON.classes)}</View>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Wins</Text>
                        <View>{getMegaWallsWins(playerJSON.classes, playerJSON)}</View>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>FKs</Text>
                        <View>{getMegaWallsFinalKills(playerJSON.classes, playerJSON)}</View>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>FK/FD</Text>
                        <View>{getMegaWallsFinalKD(playerJSON.classes, playerJSON)}</View>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>K/D</Text>
                        <View>{getMegaWallsKD(playerJSON.classes, playerJSON)}</View>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Prestige</Text>
                        <View>{getMegaWallsPrestige(playerJSON.classes, playerJSON)}</View>
                    </View>
                </View>
            </View>
        )
    }
}

function displayMMInformation(murderMysteryState, playerJSON){
    if(murderMysteryState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <View style ={styles.flexRow}>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Mode</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Classic</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Assassins</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Double Up</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Wins</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_MURDER_CLASSIC)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_MURDER_ASSASSINS)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_MURDER_DOUBLE_UP)}</Text>

                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Kills</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_MURDER_CLASSIC)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_MURDER_ASSASSINS)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_MURDER_DOUBLE_UP)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Bow Kills</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bow_kills_MURDER_CLASSIC)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bow_kills_MURDER_ASSASSINS)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bow_kills_MURDER_DOUBLE_UP)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Knife Kills</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.knife_kills_MURDER_CLASSIC)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.knife_kills_MURDER_ASSASSINS)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.knife_kills_MURDER_DOUBLE_UP)}</Text>
                    </View>
                </View>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <View style ={styles.flexRow}>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Other</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Infection 2</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Wins</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_MURDER_INFECTION)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Kills Survivor</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_as_survivor_MURDER_INFECTION)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Kills Infected</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_as_infected_MURDER_INFECTION)}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

function displaySkywarsInformation(skywarsState, playerJSON){
    if(skywarsState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Level:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{getSkyWarsLevel(validate(playerJSON.levelFormatted))}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Assists:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.assists)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Deaths:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.deaths)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kill/Death Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills), validate(playerJSON.deaths), false)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Losses:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.losses)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Win/Loss Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins), validate(playerJSON.losses), false)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Blocks Broken:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.blocks_broken)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Blocks Placed:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.blocks_placed)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Soul Well Uses:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.soul_well)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Soul Well Legendaries:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.soul_well_legendaries)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Soul Well Rares:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.soul_well_rares)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Eggs Thrown:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.egg_thrown)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Ender Pearls Thrown:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.enderpearls_thrown)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Arrows Shot:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.arrows_shot)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Arrows Hit:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.arrows_hit)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Arrows Hit/Miss Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.arrows_hit), validate(playerJSON.arrows_shot), false)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <View style ={styles.flexRow}>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Mode</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Ranked</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Solo Normal</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Solo Insane</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Teams Normal</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Teams Insane</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Mega</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Mega Doubles</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Kills</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_ranked_normal)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_solo_normal)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_solo_insane)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_team_normal)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_team_insane)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_mega_normal)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_mega_doubles_normal)}</Text>

                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>K/D</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills_ranked_normal), validate(playerJSON.deaths_ranked_normal), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills_solo_normal), validate(playerJSON.deaths_solo_normal), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills_solo_insane), validate(playerJSON.deaths_solo_insane), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills_team_normal), validate(playerJSON.deaths_team_normal), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills_team_insane), validate(playerJSON.deaths_team_insane), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills_mega_normal), validate(playerJSON.deaths_mega_normal), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills_mega_doubles_normal), validate(playerJSON.deaths_megal_doubles_normal), false)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Wins</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_ranked_normal)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_solo_normal)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_solo_insane)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_team_normal)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_team_insane)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_mega_normal)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_mega_doubles_normal)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>W/L</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins_ranked_normal), validate(playerJSON.losses_ranked_normal), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins_solo_normal), validate(playerJSON.losses_solo_normal), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins_solo_insane), validate(playerJSON.losses_solo_insane), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins_team_normal), validate(playerJSON.losses_team_normal), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins_team_insane), validate(playerJSON.losses_team_insane), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins_mega_normal), validate(playerJSON.losses_mega_normal), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins_mega_doubles_normal), validate(playerJSON.losses_megal_doubles_normal), false)}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

function displaySmashHerosInformation(smashHerosState, playerJSON){
    if(smashHerosState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Smash Level:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.smashLevel)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <View style ={styles.flexRow}>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Mode</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>1v1v1v1</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>2v2</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>2v2v2</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Kills</Text>      
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_normal)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_2v2)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_teams)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>K/D</Text>                
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills_normal), validate(playerJSON.deaths_normal), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills_2v2), validate(playerJSON.deaths_2v2), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills_teams), validate(playerJSON.deaths_teams), false)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Wins</Text>                       
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_normal)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_2v2)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_teams)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>W/L</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins_normal), validate(playerJSON.losses_normal), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins_2v2), validate(playerJSON.losses_2v2), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins_teams), validate(playerJSON.losses_teams), false)}</Text>
                    </View>
                </View>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <View style ={styles.flexRow}>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Hero</Text>
                        <View>{getSmashHeroesClasses(playerJSON)}</View>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Level</Text>
                        <View>{getSmashHeroesClassLevel(playerJSON)}</View>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Prestige</Text>
                        <View>{getSmashHeroesClassPrestige(playerJSON)}</View>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Kills</Text>
                        <View>{getSmashHeroesClassKills(playerJSON)}</View>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Wins</Text>
                        <View>{getSmashHeroesClassWins(playerJSON)}</View>
                    </View>
                </View>
            </View>
        )
    }
}

function displaySpeedUHCInformation(speedUHCState, playerJSON){
    if(speedUHCState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Deaths:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.deaths)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Losses:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.losses)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kill/Death Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills), validate(playerJSON.deaths), false)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Win/Loss Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins), validate(playerJSON.losses), false)}</Text></Text>
            </View>
        )
    }
}

function displayTNTGamesInformation(tntGamesState, playerJSON){
    if(tntGamesState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>TNT Run Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_tntrun)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>TNT Run Record Time:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{timeCalc(validate(playerJSON.record_tntrun))}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>PVP Run Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_pvprun)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>PVP Run Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_pvprun)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>PVP Run Record:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{timeCalc(validate(playerJSON.record_pvprun))}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>TNT Tag Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_tntag)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Bow Spleef Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_bowspleef)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Bow Spleef Losses:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.deaths_bowspleef)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Wizards Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_capture)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Wizards Deaths:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.deaths_capture)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Wizards Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_capture)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kill/Death Ratio Wizards:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills_capture), validate(playerJSON.deaths_capture), false)}</Text></Text>
            </View>
        )
    }
}

function displayUHCInformation(uhcState, playerJSON){
    if(uhcState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Score:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.score)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <View style ={styles.flexRow}>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Mode</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Solo</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Teams</Text>                       
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Red vs Blue</Text>                       
                        <Text style ={styles.cardTextStyleInnerHighlighted}>No Diamonds</Text>                       
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Vanilla Doubles</Text>                       
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Brawl</Text>                       
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Solo Brawl</Text>                       
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Duo Brawl</Text>                       
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Total</Text>                                             
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Kills</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["kills_solo"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["kills"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["kills_red vs blue"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["kills_no diamonds"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["kills_vanilla doubles"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["kills_brawl"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["kills_solo brawl"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["kills_duo_brawl"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["kills_solo"]) + validate(playerJSON["kills"]) + validate(playerJSON["kills_red vs blue"]) + validate(playerJSON["kills_no diamonds"]) + validate(playerJSON["kills_vanilla doubles"]) + validate(playerJSON["kills_brawl"]) + validate(playerJSON["kills_solo_brawl"]) + validate(playerJSON["kills_duo_brawl"])}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Wins</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_solo)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["wins_red vs blue"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["wins_no diamonds"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["wins_vanilla doubles"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_brawl)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["wins_solo brawl"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_duo_brawl)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins) + validate(playerJSON.wins_solo) + validate(playerJSON["wins_red vs blue"]) + validate(playerJSON["wins_no diamonds"]) + validate(playerJSON["wins_vanilla doubles"]) + validate(playerJSON.wins_brawl) + validate(playerJSON.wins_solo_brawl) + validate(playerJSON.wins_duo_brawl)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>K/D</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON["kills_solo"]), validate(playerJSON["deaths_solo"]), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON["kills"]), validate(playerJSON["deaths"]), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON["kills_red vs blue"]), validate(playerJSON["deaths_red vs blue"]), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON["kills_no diamonds"]), validate(playerJSON["deaths_no diamonds"]), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON["kills_vanilla doubles"]), validate(playerJSON["deaths_vanilla doubles"]), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON["kills_brawl"]), validate(playerJSON["deaths_brawl"]), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON["kills_solo brawl"]), validate(playerJSON["deaths_solo brawl"]), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON["kills_duo_brawl"]), validate(playerJSON["deaths_duo_brawl"]), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON["kills_solo"]) + validate(playerJSON["kills"]) + validate(playerJSON["kills_red vs blue"]) + validate(playerJSON["kills_no diamonds"]) + validate(playerJSON["kills_vanilla doubles"]) + validate(playerJSON["kills_brawl"]) + validate(playerJSON["kills_solo brawl"]) + validate(playerJSON["kills_duo_brawl"]), validate(playerJSON["deaths_solo"]) + validate(playerJSON["deaths"]) + validate(playerJSON["deaths_red vs blue"]) + validate(playerJSON["deaths_no diamonds"]) + validate(playerJSON["deaths_vanilla doubles"]) + validate(playerJSON["deaths_brawl"]) + validate(playerJSON["deaths_solo brawl"]) + validate(playerJSON["deaths_duo_brawl"]), false)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Heads Used</Text>  
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["heads_eaten_solo"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["heads_eaten"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["heads_eaten_red vs blue"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["heads_eaten_no diamonds"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["heads_eaten_vanilla doubles"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["heads_eaten_brawl"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["heads_eaten_solo brawl"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON["heads_eaten_duo_brawl"])}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.heads_eaten) + validate(playerJSON.heads_eaten_solo) + validate(playerJSON["heads_eaten_red vs blue"]) + validate(playerJSON["heads_eaten_no diamonds"]) + validate(playerJSON["heads_eaten_vanilla doubles"]) + validate(playerJSON.heads_eaten_brawl) + validate(playerJSON["heads_eaten_solo brawl"]) + validate(playerJSON.heads_eaten_duo_brawl)}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

function displayWarlordsInformation(warlordsState, playerJSON){
    if(warlordsState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Assists:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.assists)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Assist/Kill Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.assists), validate(playerJSON.kills), false)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Deaths:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.deaths)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kill/Death Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills), validate(playerJSON.deaths), false)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Wins CTF:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_capturetheflag)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Wins Domination:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.winsdomination)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Wins Team Deathmatch:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_teamdeathmatch)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Losses:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.losses)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Total Repaired:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.repaired)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Flags Captured:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.flag_conquer_self)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Flags Returned:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.flag_returns)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <View style ={styles.flexRow}>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Class</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Mage</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Warrior</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Paladin</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Shaman</Text>
                    </View>
                    {/* <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Level</Text>
                        
                    </View> */}
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Wins</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{shortenAmount(validate(playerJSON.wins_mage))}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{shortenAmount(validate(playerJSON.wins_warrior))}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{shortenAmount(validate(playerJSON.wins_paladin))}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{shortenAmount(validate(playerJSON.wins_shaman))}</Text>
                        
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Damage</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{shortenAmount(validate(playerJSON.damage_mage))}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{shortenAmount(validate(playerJSON.damage_warrior))}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{shortenAmount(validate(playerJSON.damage_paladin))}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{shortenAmount(validate(playerJSON.damage_shaman))}</Text>
                        
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Prevent</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{shortenAmount(validate(playerJSON.damage_prevented_mage))}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{shortenAmount(validate(playerJSON.damage_prevented_warrior))}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{shortenAmount(validate(playerJSON.damage_prevented_paladin))}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{shortenAmount(validate(playerJSON.damage_prevented_shaman))}</Text>
                        
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Healing</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{shortenAmount(validate(playerJSON.heal_mage))}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{shortenAmount(validate(playerJSON.heal_warrior))}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{shortenAmount(validate(playerJSON.heal_paladin))}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{shortenAmount(validate(playerJSON.heal_shaman))}</Text>
                        
                    </View>
                </View>
            </View>
        )
    }
}

function displayArenaBrawlInformation(arenaBrawlState, playerJSON){
    if(arenaBrawlState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <View style ={styles.flexRow}>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Mode</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>1v1</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>2v2</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>4v4</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Kills</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_1v1)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_2v2)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_4v4)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Wins</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_1v1)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_2v2)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_4v4)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>K/D</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills_1v1), validate(playerJSON.kills_1v1), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills_2v2), validate(playerJSON.kills_2v2), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills_4v4), validate(playerJSON.kills_4v4), false)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>W/L</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins_1v1), validate(playerJSON.losses_1v1), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins_2v2), validate(playerJSON.losses_2v2), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins_4v4), validate(playerJSON.losses_4v4), false)}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

function displayPaintBallInformation(paintballState, playerJSON){
    if(paintballState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Force Field Time:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{timeCalc(validate(playerJSON.forcefieldTime))}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Deaths:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.deaths)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Killstreaks:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.killstreaks)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Shots:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.shots_fired)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kill/Death Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills), validate(playerJSON.deaths), false)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Shots/Kill Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.shots_fired), validate(playerJSON.kills), false)}</Text></Text>
            </View>
        )
    }
}

function displayQuakeInformation(quakeState, playerJSON, fullJSON){
    if(quakeState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Highest Killstreak:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.highest_killstreak)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Dash Cooldown:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.dash_cooldown)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Godlikes:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(fullJSON.achievements.quake_godlikes)}</Text></Text>
                <View style ={styles.flexRow}>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Mode</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Solo</Text>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Teams</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Kills</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills_teams)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Wins</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins_teams)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>K/D</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills), validate(playerJSON.deaths), false)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills_teams), validate(playerJSON.deaths_teams), false)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Headshots</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.headshots)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.headshots_teams)}</Text>
                    </View>
                    <View style ={styles.tableViewStyle}>
                        <Text style ={styles.cardTextStyleInnerHighlighted}>Streaks</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.killstreaks)}</Text>
                        <Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.killstreaks_teams)}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

function displayTKRInformation(tkrState, playerJSON){
    if(tkrState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Grand Prix Tokens:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.grand_prix_tokens)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Gold Trophys:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.gold_trophy)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Silver Trophys:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.silver_trophy)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Bronze Trophys:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.bronze_trophy)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Laps Completed:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.laps_completed)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins Picked Up:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins_picked_up)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Boxes Picked Up:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.box_pickups)}</Text></Text>
            </View>
        )
    }
}

function displayVampirezInformation(vampirezState, playerJSON){
    if(vampirezState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Human Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.human_kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Human Deaths:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.human_deaths)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Human Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.human_wins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Zombie Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.zombie_kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Vampire Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.vampire_kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Vampire Deaths:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.vampire_deaths)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Vampire Kill/Death Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.vampire_kills), validate(playerJSON.vampire_deaths), false)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Human Kill/Death Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.human_kills), validate(playerJSON.human_deaths), false)}</Text></Text>
            </View>
        )
    }
}

function displayWallsInformation(wallsState, playerJSON){
    if(wallsState){
        return(
            <View>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Coins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.coins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerUnhighlighted}>{" "}</Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kills:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.kills)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Deaths:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.deaths)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Wins:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.wins)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Losses:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{validate(playerJSON.losses)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Kill/Death Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.kills), validate(playerJSON.deaths), false)}</Text></Text>
                <Text style ={styles.cardTextStyleInnerHighlighted}>Win/Loss Ratio:{" "}<Text style={styles.cardTextStyleInnerUnhighlighted}>{accuracyCalc(validate(playerJSON.wins), validate(playerJSON.losses), false)}</Text></Text>

            </View>
        )
    }
}

function validate(value){
    if(value !== undefined){
        return value
    }
    return 0
}

function validateBSGLevel(value, kitJSON, kitName){
    if(kitName == "phoenix" || kitName == "ranger" || kitName == "donkeytamer" || kitName =="warrior"){
        let kitExp = validate(kitJSON);
        if(kitExp > 0){
            if(kitExp < 100){
                return;
            }
            if(kitExp < 250){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>II</Text>);
            }
            if(kitExp < 500){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>III</Text>);
            }
            if(kitExp < 1000){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>IV</Text>);
            }
            if(kitExp < 1500){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>V</Text>);
            }
            if(kitExp < 2000){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>VI</Text>);
            }
            if(kitExp < 2500){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>VII</Text>);
            }
            if(kitExp < 5000){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>VIII</Text>);
            }
            if(kitExp < 10000){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>IX</Text>);
            }
            if(kitExp >= 10000){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>X</Text>);
            }
        }
    }else{
        let num = validate(kitJSON)
        if(num != 0){
            if(num == 1){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>II</Text>);
            }
            if(num == 2){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>III</Text>);
            }
            if(num == 3){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>IV</Text>);
            }
            if(num == 4){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>V</Text>);
            }
            if(num == 5){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>VI</Text>);
            }
            if(num == 6){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>VII</Text>);
            }
            if(num == 7){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>VIII</Text>);
            }
            if(num == 8){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>IX</Text>);
            }
            if(num == 9){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>X</Text>);
            }
        }
    }
}

function validateBSGKit(value, kitJSON, kitName, trueKitName){
    if(kitName == "phoenix" || kitName == "ranger" || kitName == "donkeytamer" || kitName =="warrior"){
        let kitExp = validate(kitJSON);
        if(kitExp > 0){
            if(kitExp < 100){
                return;
            }else{
                return (<Text style ={styles.cardTextStyleInnerHighlighted}>{trueKitName}</Text>);
            }
        }
    }else{
        let num = validate(kitJSON)
        if(num != 0){
            return (<Text style ={styles.cardTextStyleInnerHighlighted}>{trueKitName}</Text>);
        }
    }
}

function validateBSGPrestige(value, kitJSON, kitName){
    if(kitName == "phoenix" || kitName == "ranger" || kitName == "donkeytamer" || kitName =="warrior"){
        let kitExp = validate(kitJSON);
        if(kitExp > 0){
            if(kitExp < 100){
                return;
            }else{
                if(value.includes(kitName + "_pres_2")){
                    return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>{" II"}</Text>)
                }
                if(value.includes(kitName + "_pres_1")){
                    return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>{" I"}</Text>)
                } 
                return(<Text style ={styles.cardTextStyleInnerUnhighlighted}>{" - "}</Text>)
            }
        }
    }else{
        let num = validate(kitJSON)
        if(num != 0){
            if(value.includes(kitName + "_pres_2")){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>{" II"}</Text>)
            }
            if(value.includes(kitName + "_pres_1")){
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>{" I"}</Text>)
            } 
            return(<Text style ={styles.cardTextStyleInnerUnhighlighted}>{" - "}</Text>)
        }
    }
}

function validateBSGStats(value, kitJSON, kitName, soloStatsJSON, teamsStatsJSON){
    if(kitName == "phoenix" || kitName == "ranger" || kitName == "donkeytamer" || kitName =="warrior"){
        let kitExp = validate(kitJSON);
        if(kitExp > 0){
            if(kitExp < 100){
                return;
            }else{
                return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(soloStatsJSON) + validate(teamsStatsJSON)}</Text>)
            }
        }
    }else{
        let num = validate(kitJSON)
        if(num != 0){
            return (<Text style ={styles.cardTextStyleInnerUnhighlighted}>{validate(soloStatsJSON) + validate(teamsStatsJSON)}</Text>)
        }
    }
}

function getMegaWallsClasses(classesJSON){
    return Object.keys(classesJSON).map((obj, index) =>{
        const key = index
        if(classesJSON[obj].unlocked){
            return <Text style ={styles.cardTextStyleInnerHighlighted} key={key}>{firstLetterToUpperCase(obj)}</Text>
        }
    })
}

function getMegaWallsWins(classesJSON, playerJSON){
    return Object.keys(classesJSON).map((obj, index) =>{
        const key = index
        if(classesJSON[obj].unlocked){
            return <Text style ={styles.cardTextStyleInnerUnhighlighted} key={key}>{validate(playerJSON[obj + "_wins"])}</Text>
        }
    })
}

function getMegaWallsFinalKills(classesJSON, playerJSON){
    return Object.keys(classesJSON).map((obj, index) =>{
        const key = index
        if(classesJSON[obj].unlocked){
            return <Text style ={styles.cardTextStyleInnerUnhighlighted} key={key}>{validate(playerJSON[obj + "_final_kills"])}</Text>
        }
    })
}

function getMegaWallsFinalKD(classesJSON, playerJSON){
    return Object.keys(classesJSON).map((obj, index) =>{
        const key = index
        if(classesJSON[obj].unlocked){
            return <Text style ={styles.cardTextStyleInnerUnhighlighted} key={key}>{accuracyCalc(validate(playerJSON[obj + "_final_kills"]), validate(playerJSON[obj+"_final_deaths"]), false)}</Text>
        }
    })
}

function getMegaWallsKD(classesJSON, playerJSON){
    return Object.keys(classesJSON).map((obj, index) =>{
        const key = index
        if(classesJSON[obj].unlocked){
            return <Text style ={styles.cardTextStyleInnerUnhighlighted} key={key}>{accuracyCalc(validate(playerJSON[obj + "_kills"]), validate(playerJSON[obj+"_deaths"]), false)}</Text>
        }
    })
}

function getMegaWallsPrestige(classesJSON, playerJSON){
    return Object.keys(classesJSON).map((obj, index) =>{
        const key = index
        if(classesJSON[obj].unlocked){
            return <Text style ={styles.cardTextStyleInnerUnhighlighted} key={key}>{validate(classesJSON[obj].prestige)}</Text>
        }
    })
}

function getSmashHeroesClasses(playerJSON){
    return Object.keys(playerJSON.class_stats).map((obj, index) =>{
        const key = index
        return <Text style ={styles.cardTextStyleInnerHighlighted} key={key}>{smashHeroesClassInterpreter(obj)}</Text>
    })
}

function getSmashHeroesClassKills(playerJSON){
    return Object.keys(playerJSON.class_stats).map((obj, index) =>{
        const key = index
        return <Text style ={styles.cardTextStyleInnerUnhighlighted} key={key}>{validate(playerJSON.class_stats[obj].kills)}</Text>
    })
}

function getSmashHeroesClassWins(playerJSON){
    return Object.keys(playerJSON.class_stats).map((obj, index) =>{
        const key = index
        return <Text style ={styles.cardTextStyleInnerUnhighlighted} key={key}>{validate(playerJSON.class_stats[obj].wins)}</Text>
    })
}

function getSmashHeroesClassLevel(playerJSON){
    return Object.keys(playerJSON.class_stats).map((obj, index) =>{
        const key = index
        return <Text style ={styles.cardTextStyleInnerUnhighlighted} key={key}>{validate(playerJSON["lastLevel_" + obj])}</Text>
    })
}

function getSmashHeroesClassPrestige(playerJSON){
    return Object.keys(playerJSON.class_stats).map((obj, index) =>{
        const key = index
        return <Text style ={styles.cardTextStyleInnerUnhighlighted} key={key}>{validate(playerJSON["pg_" + obj])}</Text>
    })
}

function smashHeroesClassInterpreter(className){
    if(className == "FROSTY"){
        return "Cryomancer"
    }
    if(className == "SHOOP_DA_WHOOP"){
        return "Shoop"
    }
    if(className == "DUSK_CRAWLER"){
        return "Void Crawler"
    }
    if(className == "SERGEANT SHIELD"){
        return "Sgt. Shield"
    }
    if(className == "GOKU"){
        return "Karakot"
    }
    if(className == "SPODERMAN"){
        return "Spooderman"
    }
    var words = className.split("_")
    for(var i = 0; i < words.length; i++){
        words[i] = words[i].toLowerCase();
    }
    var output = ""
    for(var i = 0; i < words.length; i++){
        if(i == 0){
            output += firstLetterToUpperCase(words[i])
        }else{
            output += " " + firstLetterToUpperCase(words[i])
        }
    }
    return output
}

function firstLetterToUpperCase(str){
    var firstLetter = str[0]
    firstLetter = firstLetter.toUpperCase()

    return (firstLetter + str.slice(1))
}

function getSkyWarsLevel(str){
    if(str == 0){
        return 0;
    }
    return (str.slice(2, str.length - 1))
}

function timeCalc(seconds){
    if(seconds > 3600){
        var hours = Math.floor(seconds/3600)
        var min = Math.floor((seconds % 3600) / 60)
        var sec = seconds % 60
    }else{
        var hours = 0
        var sec = seconds % 60
        var min = Math.floor(seconds/60)
    }
    if(sec < 10){
        sec = "0" + sec
    }
    if(min < 10){
        min = "0" + min
    }
    if(hours < 10){
        hours = "0" + hours
    }
    return(hours + ":" + min + ":" + sec)
}

function shortenAmount(amount){
    if(amount > 10000000){
        var shortened = Math.floor(amount/1000)
        return (shortened + "k")
    }
    return amount
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#000000'
    },
    rectangle:{
        width: '100%',
        height: 122,
        backgroundColor: '#1E1E1E'
    },
    headerText:{
        color: '#F56334',
        flex: 1,
        paddingTop: 55,
        paddingLeft: 16,
        fontSize: 30,
        fontWeight: 'bold'
    },
    search:{
        paddingTop: 150,
        paddingLeft: 30,
        paddingRight: 30
    },
    searchBar:{
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
        padding: 15
    },
    randomView:{
        flexDirection: 'row'
    },
    imageStyling:{
        paddingTop: 55,
        paddingLeft: 16,
    },
    cardContainerStyling:{
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15
    },
    cardStyling:{
        backgroundColor: "#1E1E1E",
        padding: 15,
        borderRadius: 20,
    },
    cardTextStyle:{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F56334',
        maxWidth: '90%',
        paddingBottom: 12
    },
    cardTextStyleUnopened:{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F56334',
        maxWidth: '90%',
    },
    cardTextStyleInnerHighlighted:{
        fontSize: 15,
        fontWeight: 'normal',
        color: '#F56334',
    },
    cardTextStyleInnerUnhighlighted:{
        fontSize: 15,
        fontWeight: 'normal',
        color: '#6B6B6B',
    },
    flexRow:{
        flexDirection: 'row',
    },
    tableViewStyle:{
        paddingRight: 10
    },
    favoriteStyling:{
        // justifyContent: 'space-between'
    }, 
    weirdStyleThing:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})
export default Stats;