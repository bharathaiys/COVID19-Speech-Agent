// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
// const {Card, Suggestion} = require('dialogflow-fulfillment');
const bent=require('bent');
const getJSON= bent('json');

 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) 
  {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) 
  {
    agent.add(`I didn't understand. The question you asked might not be related to COVID-19`);
    agent.add(`I'm sorry, can you try again? The question you asked might not be related to COVID-19`);
  }

  function worldStats(agent) 
  {
    const type=agent.parameters.type;

    return getJSON('https://coronavirus-tracker-api.herokuapp.com/v2/latest?source=jhu').then((result)=>{
      agent.add('From the latest data available, ');
      // agent.add(type);
      var i;
      if(type.length>=3)
      {
        agent.add('There are currently '+result.latest.confirmed+' confirmed cases of COVID-19, '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases worldwide.');
      }
      else
      {  
        for(i=0;i<type.length;i++)
        {
          if(i>=1)
            agent.add('In addition,');
          switch(type[i])
          {
            case 'confirmed':
              agent.add('There are currently '+result.latest.confirmed+' confirmed cases of COVID-19 worldwide.');
              break;
            case 'deaths':
              agent.add('There are currently '+result.latest.deaths+' deaths due to COVID-19 worldwide.');
              break;
            case 'recovered':
              agent.add('There are currently '+result.latest.recovered+' recovered cases of COVID-19 worldwide.');
              break;
            default:
              agent.add('There are currently '+result.latest.confirmed+' confirmed cases of COVID-19, '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases worldwide.');
          }
        }
      }
      }).catch((error)=>{
        console.error(error);
        });
  }
 
  function locStats(agent) 
  {
    const type=agent.parameters.type;
    const cntry=agent.parameters.country;
    const st=agent.parameters.state;
	  const cnty=agent.parameters.County;
    // agent.add(st);
    // agent.add(type);
    if(cnty!=""&&st=='')
    {
      var cntyn2;

      var pos=cnty[0].indexOf("ounty");
      if(pos==-1)
      {
        pos=cnty[0].indexOf("arish");
      }
      const cntyn=cnty[0].substr(0,(pos-2));

      if(cnty.length>1)
      {
      var pos2=cnty[1].indexOf("ounty");
      if(pos2==-1)
      {
        pos2=cnty[1].indexOf("arish");
      }
      cntyn2=cnty[1].substr(0,(pos2-2));
      }

      return getJSON('https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs&county='+cntyn).then((result)=>{
        agent.add('From the latest data available, ');
        var i;
        if(type.length>=3)
        {
          agent.add('There are currently '+result.latest.confirmed+' confirmed cases of COVID-19, '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases in '+cnty[0]+'.');
        }
        else
        {  
          for(i=0;i<type.length;i++)
          {
            if(i>=1)
              agent.add('In addition,');
            switch(type[i])
            {
              case 'confirmed':
                agent.add('There are currently '+result.latest.confirmed+' confirmed cases of COVID-19 in '+cnty[0]+'.');
                break;
              case 'deaths':
                agent.add('There are currently '+result.latest.deaths+' deaths due to COVID-19 in '+cnty[0]+'.');
                break;
              case 'recovered':
                agent.add('There are currently '+result.latest.recovered+' recovered cases of COVID-19 in '+cnty[0]+'.');
                break;
              default:
                agent.add('There are currently '+result.latest.confirmed+' confirmed cases of COVID-19, '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases in '+cnty[0]+'.');
            }
          }
        }
        if(cnty.length>1)
        {
        return getJSON('https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs&county='+cntyn2).then((result)=>{
        agent.add('And, there are');
        var i;
        if(type.length>=3)
        {
          agent.add(+result.latest.confirmed+' confirmed cases, '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases in '+cnty[1]+'.');
        }
        else
        {  
          for(i=0;i<type.length;i++)
          {
            if(i>=1)
              agent.add('In addition, there are ');
            switch(type[i])
            {
              case 'confirmed':
                agent.add(+result.latest.confirmed+' confirmed cases in '+cnty[1]+'.');
                break;
              case 'deaths':
                agent.add(+result.latest.deaths+' deaths in '+cnty[1]+'.');
                break;
              case 'recovered':
                agent.add(+result.latest.recovered+' recovered cases in '+cnty[1]+'.');
                break;
              default:
                agent.add(+result.latest.confirmed+' confirmed cases, '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases in '+cnty[1]+'.');
            }
          }
        }
        }).catch((error)=>{
          console.error(error);
          });
        }
      }).catch((error)=>{
        console.error(error);
        });
    }


    else if(cnty!=""&&st!='')
    {
      var cntyn2;
      var st2;

      var pos=cnty[0].indexOf("ounty");
      if(pos==-1)
      {
        pos=cnty[0].indexOf("arish");
      }
      const cntyn=cnty[0].substr(0,(pos-2));

      if(cnty.length>1)
      {
        var pos2=cnty[1].indexOf("ounty");
        if(pos2==-1)
        {
          pos2=cnty[1].indexOf("arish");
        }
        cntyn2=cnty[1].substr(0,(pos2-2));
      }

      if(st.length>1)
      {
        st2=st[1];
      }
      else
      {
        st2=st[0];
      }

      return getJSON('https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs&province='+st[0]+'&county='+cntyn).then((result)=>{
       agent.add('From the latest data available, ');
        var i;
        if(type.length>=3)
        {
          agent.add('There are currently '+result.latest.confirmed+' confirmed cases of COVID-19, '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases in '+cnty[0]+', '+st[0]+'.');
        }
        else
        {  
          for(i=0;i<type.length;i++)
          {
            if(i>=1)
              agent.add('In addition,');
            switch(type[i])
            {
              case 'confirmed':
                agent.add('There are currently '+result.latest.confirmed+' confirmed cases of COVID-19 in '+cnty[0]+', '+st[0]+'.');
                break;
              case 'deaths':
                agent.add('There are currently '+result.latest.deaths+' deaths due to COVID-19 in '+cnty[0]+', '+st[0]+'.');
                break;
              case 'recovered':
                agent.add('There are currently '+result.latest.recovered+' recovered cases of COVID-19 in '+cnty[0]+', '+st[0]+'.');
                break;
              default:
                agent.add('There are currently '+result.latest.confirmed+' confirmed cases of COVID-19, '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases in '+cnty[0]+', '+st[0]+'.');
            }
          }
        }
        if(cnty.length>1)
        {
          return getJSON('https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs&province='+st2+'&county='+cntyn2).then((result)=>{
            agent.add('And, there are ');
            var i;
            if(type.length>=3)
            {
              agent.add(+result.latest.confirmed+' confirmed cases , '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases in '+cnty[1]+', '+st2+'.');
            }
            else
            {  
              for(i=0;i<type.length;i++)
              {
                if(i>=1)
                  agent.add('In addition, there are ');
                switch(type[i])
                {
                  case 'confirmed':
                    agent.add(+result.latest.confirmed+' confirmed cases in '+cnty[1]+', '+st2+'.');
                    break;
                  case 'deaths':
                    agent.add(+result.latest.deaths+' deaths in '+cnty[1]+', '+st2+'.');
                    break;
                  case 'recovered':
                    agent.add(+result.latest.recovered+' recovered cases in '+cnty[1]+', '+st2+'.');
                    break;
                  default:
                    agent.add(+result.latest.confirmed+' confirmed cases, '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases in '+cnty[1]+', '+st2+'.');
                }
              }
            }
          }).catch((error)=>{
            console.error(error);
            });
        }
      }).catch((error)=>{
        console.error(error);
        });
    }


    else if(st!=''&&cnty=='')
    {
    // var j;
      // const l=st.length;
    //  agent.add("Length" +l);
    //  for (var k = 0; k < st.length; k++) {
    //    agent.add("Here");
    //  }
      // for(j=0;j<st.length;j++)
      // {
        //if(j>=1)
          //agent.add('And in addition,');
      //  agent.add("Here");      
      
      return getJSON('https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs&province='+st[0]).then((result)=>{
        agent.add('From the latest data available ');
        var i;
        if(type.length>=3)
        {
          agent.add('There are currently '+result.latest.confirmed+' confirmed cases of COVID-19, '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases in '+st[0]+'.');
        }
        else
        {  
          for(i=0;i<type.length;i++)
          {
            if(i>=1)
              agent.add('In addition,');
            switch(type[i])
            {
              case 'confirmed':
                agent.add('There are currently '+result.latest.confirmed+' confirmed cases of COVID-19 in '+st[0]+'.');
                break;
              case 'deaths':
                agent.add('There are currently '+result.latest.deaths+' deaths due to COVID-19 in '+st[0]+'.');
                break;
              case 'recovered':
                agent.add('There are currently '+result.latest.recovered+' recovered cases of COVID-19 in '+st[0]+'.');
                break;
              default:
                agent.add('There are currently '+result.latest.confirmed+' confirmed cases of COVID-19, '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases in '+st[0]+'.');
            }
          }
        }
        return getJSON('https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=csbs&province='+st[1]).then((result)=>{
          agent.add('And, there are ');
          var i;
          if(type.length>=3)
          {
            agent.add(+result.latest.confirmed+' confirmed cases, '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases in '+st[1]+'.');
          }
          else
          {  
            for(i=0;i<type.length;i++)
            {
              if(i>=1)
              agent.add('In addition, there are ');
              switch(type[i])
              {
                case 'confirmed':
                  agent.add(+result.latest.confirmed+' confirmed cases in '+st[1]+'.');
                  break;
                case 'deaths':
                  agent.add(+result.latest.deaths+' deaths in '+st[1]+'.');
                  break;
                case 'recovered':
                  agent.add(+result.latest.recovered+' recovered cases in '+st[1]+'.');
                  break;
                default:
                  agent.add(+result.latest.confirmed+' confirmed cases, '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases in '+st[1]+'.');
              }
            }
          }
        }).catch((error)=>{
          console.error(error);
          });
      }).catch((error)=>{
        console.error(error);
        });
    }
  

    else if(cntry!='') 
    { 
      const time=agent.parameters.time;

      if(time=='')
      {
        var cntryn2;
        const cntryn=cntry[0]["alpha-2"];
        // agent.add(cntryn);

        if(cntry.length>1)
        {
        cntryn2=cntry[1]["alpha-2"];
        // agent.add(cntryn2);
        }
        
        return getJSON('https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=jhu&country_code='+cntryn).then((result)=>{
          agent.add('From the latest data available, ');
          var i;
          if(type.length>=3)
          {
            agent.add('There are currently '+result.latest.confirmed+' confirmed cases of COVID-19, '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases in '+cntry[0]["name"]+'.');
          }
          else
          {  
            for(i=0;i<type.length;i++)
            {
              if(i>=1)
                agent.add('In addition,');
              switch(type[i])
              {
                case 'confirmed':
                  agent.add('There are currently '+result.latest.confirmed+' confirmed cases of COVID-19 in '+cntry[0]["name"]+'.');
                  break;
                case 'deaths':
                  agent.add('There are currently '+result.latest.deaths+' deaths due to COVID-19 in '+cntry[0]["name"]+'.');
                  break;
                case 'recovered':
                  agent.add('There are currently '+result.latest.recovered+' recovered cases of COVID-19 in '+cntry[0]["name"]+'.');
                  break;
                default:
                  agent.add('There are currently '+result.latest.confirmed+' confirmed cases of COVID-19, '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases in '+cntry[0]["name"]+'.');
              }
            }
          }
    
          return getJSON('https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=jhu&country_code='+cntryn2).then((result)=>{
            agent.add('And, there are');
            var i;
            if(type.length>=3)
            {
              agent.add(+result.latest.confirmed+' confirmed cases, '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases in '+cntry[1]["name"]+'.');
            }
            else
            {  
              for(i=0;i<type.length;i++)
              {
                if(i>=1)
                  agent.add('In addition, there are ');
                switch(type[i])
                {
                  case 'confirmed':
                    agent.add(+result.latest.confirmed+' confirmed cases in '+cntry[1]["name"]+'.');
                    break;
                  case 'deaths':
                    agent.add(+result.latest.deaths+' deaths in '+cntry[1]["name"]+'.');
                    break;
                  case 'recovered':
                    agent.add(+result.latest.recovered+' recovered cases in '+cntry[1]["name"]+'.');
                    break;
                  default:
                    agent.add(+result.latest.confirmed+' confirmed cases, '+result.latest.deaths+' deaths and '+result.latest.recovered+' recovered cases in '+cntry[1]["name"]+'.');
                }
              }
            }
            }).catch((error)=>{
              console.error(error);
              });
          }).catch((error)=>{
            console.error(error);
            });
        }

        else
        {
          const cntryn=cntry[0]["alpha-2"];
          // agent.add(cntryn);
          const endt=time["endDate"];
          const startt=time["startDate"];
          // agent.add('start '+startt);
          // agent.add('end '+endt);
          var Difc;
          var Difd;
          var Difr;

          if(startt==undefined&&endt==undefined)
          {
            // agent.add('Only 1 time available '+time);
            var timeMod=time.split("T")[0];
            timeMod=timeMod+"T00:00:00Z";
            // agent.add('Time modified '+timeMod);

            return getJSON('https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=jhu&country_code='+cntryn+'&timelines=true').then((result)=>{
              

              const StartValc = result.locations[0].timelines["confirmed"].timeline[timeMod];
              // agent.add('Start Value is '+StartValc);
              var EndValc = result.latest.confirmed;
              // agent.add('End Value is '+EndValc);
              // if(StartValc==undefined)
              // {
              //   agent.add('I am sorry, the date you have asked for is not available. Could you be a little more specific? Adding the year or words like "last" would help.');
              // }
              Difc=EndValc-StartValc;
                  // agent.add('There were a total of '+Difc+' new cases in that time period');
             
              
              const StartVald = result.locations[0].timelines["deaths"].timeline[timeMod];
              // agent.add('Start Value is '+StartVald);
              var EndVald = result.latest.deaths;
              // agent.add('End Value is '+EndVald);
              Difd=EndVald-StartVald;
                // agent.add('There were a total of '+Difd+' new deaths in that time period');
              
              Difr = 0;
              
              if(StartVald==undefined || StartValc==undefined)
              {
                agent.add('I am sorry, the date you have asked for is not available. Could you be a little more specific? Adding the year or words like "last" would help.');
              }
              else
              {
                agent.add('From the latest data available, ');
                var i;
                if(type.length>=3)
                {
                  agent.add('There are currently '+Difc+' new cases of COVID-19, '+Difd+' deaths and '+Difr+' recovered cases in '+cntry[0]["name"]+'for the time period you requested.');
                }
                else
                {  
                  for(i=0;i<type.length;i++)
                  {
                    if(i>=1)
                      agent.add('In addition,');
                    switch(type[i])
                    {
                      case 'confirmed':
                        agent.add('There are currently '+Difc+' new cases of COVID-19 in '+cntry[0]["name"]+' for the time period that you requested.');
                        break;
                      case 'deaths':
                        agent.add('There are currently '+Difd+' deaths due to COVID-19 in '+cntry[0]["name"]+' for the time period that you requested.');
                        break;
                      case 'recovered':
                        agent.add('There are currently '+Difr+' recovered cases of COVID-19 in '+cntry[0]["name"]+' for the time period that you requested.');
                        break;
                      default:
                        agent.add('There are currently '+Difc+' new cases of COVID-19, '+Difd+' deaths and '+Difr+' recovered cases in '+cntry[0]["name"]+' for the time period that you requested.');
                    }
                  }
                }
              }
              }).catch((error)=>{
                console.error(error);
                });
        
          }

          else
          {
            var startmod=startt.split("T")[0];
            startmod=startmod+"T00:00:00Z";
            // agent.add('start modified '+startmod);

            var endmod=endt.split("T")[0];
            endmod=endmod+"T00:00:00Z";
            // agent.add('start modified '+endmod);
            // agent.add(result.locations[0].timelines.confirmed.latest);
            // agent.add('In getjson');

            return getJSON('https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=jhu&country_code='+cntryn+'&timelines=true').then((result)=>{
                
              const StartValc = result.locations[0].timelines["confirmed"].timeline[startmod];
              // agent.add('Start ValueC is '+StartValc);
              var EndValc = result.locations[0].timelines["confirmed"].timeline[endmod];
              // agent.add('End ValueC is '+EndValc);
              
              if(EndValc==undefined)
              {
                EndValc = result.latest.confirmed;
                // agent.add('End ValueC latest is '+EndValc);
              }
              Difc=EndValc-StartValc;
              
                
              const StartVald = result.locations[0].timelines["deaths"].timeline[startmod];
              // agent.add('Start ValueD is '+StartVald);
              var EndVald = result.locations[0].timelines["deaths"].timeline[endmod];
              // agent.add('End ValueD is '+EndVald);
              // if(StartVald==undefined)
              // {
              //   agent.add('I am sorry, the date you have asked for is not available. Could you be a little more specific? Adding the year or words like "last" would help.');
              // }
              if(EndVald==undefined)
              {
                EndVald = result.latest.deaths;
                // agent.add('End ValueD latest is '+EndVald);
              }
              Difd=EndVald-StartVald;
              // agent.add('There were a total of '+Difd+' new deaths in that time period');
                 
              Difr = 0;
              
              if(StartValc==undefined)
              {
                agent.add('I am sorry, the date you have asked for is not available. Could you be a little more specific? Adding the year or words like "last" would help.');
              }
              else
              {
                agent.add('From the latest data available, ');
                var i;
                if(type.length>=3)
                {
                  agent.add('There are currently '+Difc+' new cases of COVID-19, '+Difd+' deaths and '+Difr+' recovered cases in '+cntry[0]["name"]+'for that time period.');
                }
                else
                {  
                  for(i=0;i<type.length;i++)
                  {
                    if(i>=1)
                      agent.add('In addition,');
                    switch(type[i])
                    {
                      case 'confirmed':
                        agent.add('There are currently '+Difc+' new cases of COVID-19 in '+cntry[0]["name"]+' for that time period.');
                        break;
                      case 'deaths':
                        agent.add('There are currently '+Difd+' deaths due to COVID-19 in '+cntry[0]["name"]+' for that time period.');
                        break;
                      case 'recovered':
                        agent.add('There are currently '+Difr+' recovered cases of COVID-19 in '+cntry[0]["name"]+' for that time period.');
                        break;
                      default:
                        agent.add('There are currently '+Difc+' new cases of COVID-19, '+Difd+' deaths and '+Difr+' recovered cases in '+cntry[0]["name"]+' for that time period.');
                    }
                  }
                }
              }
              }).catch((error)=>{
                console.error(error);
                });
          }
        }  
    }
    else if(cntry=='' && st=='' && cnty=='')
    {
      agent.add(' Not sure if the location you provided exists. Or I do not have the data for it. Could you please try again?');
    }
  }

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Worldwide Stats', worldStats);
  intentMap.set('Location Based Stats', locStats);

  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
