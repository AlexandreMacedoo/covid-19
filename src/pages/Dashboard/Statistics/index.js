import React, { useState, useEffect, useMemo } from 'react';
import Background from '~/components/Background';
import Modal from 'react-native-modal';
import { ActivityIndicator } from 'react-native';
import Loading from '~/components/Loading';
import {
  Container,
  Separator,
  TotalTitle,
  TotalAmount,
  ContentBoth,
  ContentBothIndicator,
  Content,
  Title,
  Amount,
  ActiveAmount,
  NewAmount,
  RecoveredAmount,
  CriticalAmount,
  DeathAmount,
  DeathNewAmount,
  ActiveContent,
  TotalCard,
  ScrollContent,
  TotalContent,
  Header,
  ButtonModal,
  SeparatorModal,
  ContentModal,
  HeaderModal,
  TitleModal,
  CountryList,
  Country,
  Flag,
  ContainerModal,
  Logo1,
  Logo2,
  Logo3,
  AppName,
  CountryPicker,
  CountryName,
  Info,
  Date,
  Name,
  Press,
  BgWorldMap,
  Logo,
} from './styles';

import Icon from 'react-native-vector-icons/MaterialIcons';
import coronavirus from '~/assets/coronavirus.png';
import worldmap from '~/assets/coronavirus9.png';
import api from '~/services/api';
import format from '~/utils/format';
import paginate from '~/utils/paginate';

export default function Statistics() {
  const [statistics, setStatistics] = useState([]);
  const [country, setCountry] = useState({});
  const [countryName, setCountryName] = useState('Brazil');
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    async function loadStatistics() {
      const response = await api.get('statistics');
      const allStatistics = response.data.response;
      const countriesName = response.data.response.map(
        (country) => country.country,
      );
      const countryStatistics = response.data.response.find(
        (stat) => stat.country === countryName,
      );

      setStatistics(allStatistics);
      setCountries(countriesName);
      setCountry(countryStatistics);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
    loadStatistics();
  }, [countryName]);

  console.log(countries);

  function calculatePercent(total, partial) {
    const percent = (partial * 100) / total;
    return `${percent.toFixed(2)}%`;
  }

  function handleModal() {
    setVisible(!visible);
  }

  function isNull(data) {
    if (data === null) {
      return '--';
    }
    return data;
  }

  // function renderFooter() {
  //   if (!loadMore) {
  //     return null;
  //   }
  //   return <ActivityIndicator style={{ color: '#000' }} />;
  // }

  function renderItem({ item: country }) {
    return (
      <Country>
        <Flag source={coronavirus} />
        <Press
          onPress={() => {
            setCountryName(country);
            handleModal();
          }}>
          RectButton onPress is not working?????
        </Press>
        <Name
          onPress={() => {
            setCountryName(country);
            handleModal();
          }}>
          {country}
        </Name>
      </Country>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Background>
      <Container>
        <Modal isVisible={visible}>
          <ContainerModal>
            <ButtonModal onPress={handleModal}>
              <Icon name="close" size={20} color="#fff" />
            </ButtonModal>
            <ContentModal>
              <>
                <HeaderModal>
                  <TitleModal>Countries</TitleModal>
                </HeaderModal>
                <CountryList
                  data={countries}
                  ItemSeparatorComponent={() => <SeparatorModal />}
                  keyExtractor={(country) => String(country)}
                  renderItem={renderItem}
                />
              </>
            </ContentModal>
          </ContainerModal>
        </Modal>

        <Header>
          <Info>
            <AppName>COVID-19 statistics</AppName>
            <CountryPicker>
              <Press
                onPress={() => {
                  handleModal();
                }}>
                RectButton onPress is not working?????
              </Press>
              <CountryName>{countryName}</CountryName>
              <Icon name="arrow-drop-down" size={30} color="#fff" />
            </CountryPicker>
            <Date>Last update {format(country.time)}</Date>
          </Info>
          <Logo1 source={coronavirus} />
          <Logo2 source={coronavirus} />
          <Logo3 source={coronavirus} />
        </Header>

        <TotalContent>
          <TotalCard>
            <TotalTitle>CASES</TotalTitle>
            <TotalAmount>{country.cases.total}</TotalAmount>
          </TotalCard>
        </TotalContent>
        <ScrollContent>
          <ContentBoth>
            <ActiveContent>
              <Title>ACTIVE</Title>
              <ContentBothIndicator>
                <ActiveAmount>{isNull(country.cases.active)}</ActiveAmount>
                {country.cases.new ? (
                  <>
                    <Icon name="arrow-upward" size={15} color="#24c2ff" />
                    <NewAmount>{parseInt(country.cases.new)}</NewAmount>
                  </>
                ) : (
                    <></>
                  )}
              </ContentBothIndicator>
            </ActiveContent>
          </ContentBoth>

          <Separator />

          <ContentBoth>
            <Content>
              <Title>RECOVERED</Title>
              <RecoveredAmount>
                {isNull(country.cases.recovered)}
              </RecoveredAmount>
            </Content>
            <Content>
              <Title>CRITICAL</Title>
              <CriticalAmount>{isNull(country.cases.critical)}</CriticalAmount>
            </Content>
          </ContentBoth>

          <Separator />

          <ContentBoth>
            <Content>
              <Title>DEATHS</Title>
              <ContentBothIndicator>
                <DeathAmount>{isNull(country.deaths.total)}</DeathAmount>
                {country.deaths.new ? (
                  <>
                    <Icon name="arrow-upward" size={15} color="#333" />
                    <DeathNewAmount>
                      {parseInt(country.deaths.new)}
                    </DeathNewAmount>
                  </>
                ) : (
                    <></>
                  )}
              </ContentBothIndicator>
            </Content>
            <Content>
              <Title>TESTS</Title>
              <Amount>{isNull(country.tests.total)}</Amount>
            </Content>
          </ContentBoth>

          <Separator />

          <ContentBoth>
            <Content>
              <Title>MORTALITY</Title>
              <Amount>
                {calculatePercent(country.cases.total, country.deaths.total)}
              </Amount>
            </Content>
            <Content>
              <Title>RECOVERY</Title>
              <Amount>
                {calculatePercent(country.cases.total, country.cases.recovered)}
              </Amount>
            </Content>
          </ContentBoth>
        </ScrollContent>
      </Container>
    </Background>
  );
}