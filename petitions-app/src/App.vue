<template>
  <div id="app">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="/">Olivia's Plant & Food Repo Application</a>
        </div>

        <div class="nav navbar-nav navbar-right">
          <a class="navbar-brand" href="https://github.com/livvymac/Plant-Food-Test">View this Project on GitHub</a>
        </div>

      </div>
    </nav>

    <div class="container" v-if="error != ''" style="color: red"> {{error}} </div>

    <!-- Allow user to query/view their repository information -->
    <div id="Update Repository URL">
      <div class="container">
        <h2>View your current submission</h2>
        <div class="form-horizontal">
          <div class="form-group" v-if="repoInformation!=undefined && repoInformation.id!=undefined">
            <label class="col-sm-2 control-label">ID</label>
            <div class="col-sm-10"> {{repoInformation.id}} </div>
          </div>
          <div class="form-group" v-if="repoInformation!=undefined && repoInformation.email!=undefined">
            <label class="col-sm-2 control-label">Email</label>
            <div class="col-sm-10"> {{repoInformation.email}} </div>
          </div>
          <div class="form-group" v-if="repoInformation!=undefined && repoInformation.repoURL!=undefined">
            <label class="col-sm-2 control-label">Repository URL</label>
            <div class="col-sm-10"> {{repoInformation.repoURL}} </div>
          </div>
          <div class="form-group" v-if="repoInformation!=undefined && repoInformation.created!=undefined">
            <label class="col-sm-2 control-label">Date and Time of Registration</label>
            <div class="col-sm-10"> {{ getFormattedRegistrationDate() }} </div>
          </div>
          <div class="form-group" v-if="repoInformation!=undefined && repoInformation.created!=undefined">
            <label class="col-sm-2 control-label">Time Since Registration</label>
            <div class="col-sm-10"> {{ getElapsedTime() }} </div>
          </div>
        </div>
        <button class="btn btn-default pull-right" v-on:click="getRepositoryInfo">Retrieve Repository Information</button>
      </div>
    </div>

    <!-- Allow user to update their repository URL -->
    <div id="Update Repository URL">
      <div class="container">
        <h2>Update your repository URL</h2>
        <form class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-2 control-label">New Repository URL</label>
            <div class="col-sm-10">
              <input class="form-control" v-model="newRepoURL" id="repoInput" type="text" placeholder="New Repository URL">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">ID</label>
            <div class="col-sm-10">
              <input class="form-control" v-model="id" id="idInput" type="text" placeholder="Your test ID">
            </div>
          </div>
        </form>
        <button class="btn btn-default pull-right" v-on:click="submitRepository">Submit new URL</button>
      </div>
    </div>

  </div>
</template>
<script>
  import { submitRepo, confirmDetails } from './controller';

  export default {
    data() {
      return {
        error: "",
        repoInformation: {},
        newRepoURL: "",
        response: {},
        id: "",
        registrationDate: ""
      }
    },
    mounted: function() {
      this.getRepositoryInfo()
    },
    methods: {
      submitRepository: function () {
        submitRepo(this.id, this.newRepoURL)
        // submitRepo(this.id, "https://github.com/livvymac/Plant-Food-Test")
          .then ((response) => {
            console.log("response", response)
            return response.json()
          })
          .then ((json) => {
            console.log(json)
            this.response = json
            this.getRepositoryInfo()    // trigger update of repo information displayed
          })
          .catch( (err) => {
            this.error = err;

          })

      },
      getRepositoryInfo: function () {
        confirmDetails()
          .then ((response) => {
            console.log("response", response)
            return response.json()
          })
          .then ((json) => {
            console.log(json)
            this.repoInformation = json
          })
      },
      getFormattedRegistrationDate: function() {
        if (this.repoInformation == undefined || this.repoInformation.created == undefined) return ""  // if there is no current repo information fetched or it has no created date
        else {
          let registrationDate = new Date(this.repoInformation.created)
          if (registrationDate == NaN) return this.repoInformation.created  // if was not parsed successfully, return original string
          else return registrationDate.toString()   // else return string representation of date in local time
        }       
      },
      getElapsedTime: function () {   // get time elapsed since registration
        if (this.repoInformation == undefined || this.repoInformation.created == undefined) return "Unknown"  // if there is no current repo information fetched or it has no created date
        else {
          let registrationDate = new Date(this.repoInformation.created)
          if (registrationDate == NaN) return "Unknown"  // if was not parsed successfully, return "Unknown"
          else {
            let timeSince = Date.now() - registrationDate;
            return this.convertMsToTime(timeSince) + " hours"   // else return string representation of date in local time
          }
        }
      },
      convertMsToTime: function (milliseconds) {
        let seconds = Math.floor((milliseconds / 1000) % 60);
        let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
        let hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
        let leftoverMs = Math.floor((milliseconds % 1000) / 100)

        // Convert to 2-digit format
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds + "." + leftoverMs;
      }
    }
  }
</script>
