// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'

import './index.css'

const statusviewList = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class CowinDashboard extends Component {
  state = {
    dataList: '',
    vaccineAge: '',
    vaccineGender: '',
    statusview: statusviewList.initial,
  }

  componentDidMount() {
    this.getCoviddata()
  }

  getCoviddata = async () => {
    this.setState({statusview: statusviewList.loading})
    const covidVaccinationDataApiUrl =
      'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(covidVaccinationDataApiUrl)
    const data = await response.json()
    const outputData = {
      last7DaysVaccination: data.last_7_days_vaccination,
      vaccinationByAge: data.vaccination_by_age,
      vaccinationByGender: data.vaccination_by_gender,
    }
    console.log(data)
    if (response.ok === true) {
      const SevenDaysVaccination = outputData.last7DaysVaccination.map(
        eachDay => ({
          vaccineDate: eachDay.vaccineDate,
          dose1: eachDay.dose_1,
          dose2: eachDay.dose_2,
        }),
      )
      this.setState({
        dataList: SevenDaysVaccination,
        statusview: statusviewList.success,
      })
      const vaccinationAge = outputData.vaccinationByAge.map(eachVaccine => ({
        age: eachVaccine.age,
        count: eachVaccine.count,
      }))
      this.setState({
        vaccineAge: vaccinationAge,
        statusview: statusviewList.success,
      })
      const vaccinationGender = outputData.vaccinationByGender.map(
        eachGender => ({
          count: eachGender.count,
          gender: eachGender.gender,
        }),
      )
      this.setState({
        vaccineGender: vaccinationGender,
        statusview: statusviewList.success,
      })
    } else {
      this.setState({statusview: statusviewList.failure})
    }
  }

  getloading = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  getFailure = () => (
    <div>
      <h1>Something went wrong</h1>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
    </div>
  )

  getRenderData = () => {
    const {dataList, vaccineAge, vaccineGender} = this.state
    return (
      <div>
        <VaccinationCoverage dataList={dataList} />
        <VaccinationByGender vaccineGender={vaccineGender} />
        <VaccinationByAge vaccineAge={vaccineAge} />
      </div>
    )
  }

  showList = () => {
    const {statusview} = this.state
    console.log(statusview)
    switch (statusview) {
      case statusviewList.loading:
        return this.getloading()
      case statusviewList.failure:
        return this.getFailure()
      case statusviewList.success:
        return this.getRenderData()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <div className="logoContainer">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
          />
          <p>Co-WIN</p>
        </div>
        <h1>coWin Vaccination in india</h1>
        {this.showList()}
      </div>
    )
  }
}

export default CowinDashboard
