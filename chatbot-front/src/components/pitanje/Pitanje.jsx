import React from 'react';
import ChatBot from 'react-simple-chatbot';
import {Segment} from 'semantic-ui-react';
import './Pitanje.css';
import Footer from '../footer/Footer';
import { ThemeProvider } from 'styled-components';

const Pitanje = () => {


    const theme = {
        background: "url('https://i.ibb.co/yFM5VTt/ai.png')center/cover no-repeat",
        fontFamily: 'Orbitron',
        headerBgColor: 'linear-gradient(109.6deg, rgb(0, 0, 0) 11.2%, rgb(11, 132, 145) 91.1%)',
        headerFontColor: '#fff',
        headerFontSize: '20px',
        botBubbleColor: 'linear-gradient(109.6deg, rgb(0, 0, 0) 11.2%, rgb(11, 132, 145) 91.1%)',
        botFontColor: '#fff',
        userBubbleColor: 'radial-gradient(circle at 1.8% 4.8%, rgb(17, 23, 58) 0%, rgb(58, 85, 148) 90%)',
        userFontColor: '#fff',
      };

    const steps = [
        {
          id: 'Greet',
          message: 'Cao dobrodosao u CHATBOT aplikaciju! Istrazi sve mogucnosti naseg projekta!',
          trigger: 'Pitaj za ime'
        },
        {
          id: 'Pitaj za ime',
          message: 'Molim te reci mi svoje ime.',
          trigger: 'Cekanje1'
        },
        {
          id: 'Cekanje1',
          user: true,
          trigger: 'Ime'
        },
        {
          id: 'Ime',
          message: 'Zdravo {previousValue}. Oznaci sta zelis da cujes: ',
          trigger: 'Problem'
        },
        {
          id: 'Problem',
          options: [
            {
              value: 'Salu',
              label: 'Sala',
              trigger: 'Reci salu'
            },
            {
              value: 'Uvredu',
              label: 'Uvreda',
              trigger: 'Reci uvredu'
            },
          ]
        },
        {
          id: 'Reci salu',
          message: 'Tvoj zivot.🤣',
          end: true
        },
        {
          id: 'Reci uvredu',
          message: 'Bas si ruzan brate. Treba ti plasticna operacija.😎',
          end: true
        },
      ];
      

  return (
    <>
      <div className='pitanje-stranica'>
        <div className="pitanje-tekst">
            <Segment>
                <ThemeProvider className="chatbot" theme={theme}>
                    <ChatBot  steps = {steps}/>
                </ThemeProvider>
            </Segment>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Pitanje;