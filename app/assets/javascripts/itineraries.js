$(() => {
  bindClickHandlers()
})

// Hijack search and render using ajax
let mapKeys = ""
const bindClickHandlers = function() {
  $('.search-input').on('keydown', function(e) {



    // Add search input to mapKeys
    if(e.keyCode >= 65 && e.keyCode <= 90 ) {
      mapKeys += String.fromCharCode(e.keyCode)
    } else if(e.keyCode == 8 && mapKeys.length > 0) {
      mapKeys = mapKeys.substring(0, mapKeys.length - 1)
    } else if(e.keyCode == 13) {
      e.preventDefault()
    }

    history.pushState(null, null, "itineraries")

    fetch(`/itineraries.json`).then(res => res.json()).then(function(data) {

      // Remove featured itineraries
      $('.featured').html("")
      $('.search-itineraries').html("")


      // search through itineraries
      let filter = []
      function filteredItineraries(data) {
        data.forEach((itinerary) => {
          let searchTerms = mapKeys.toLowerCase()
          let itineraryTitle = itinerary.title.toLowerCase()
          let itineraryDescription = itinerary.description.toLowerCase()
          let itineraryBudget = itinerary.budget
          if(itineraryTitle.includes(searchTerms) || itineraryDescription.includes(searchTerms)) {
              filter.push(itinerary)
          }
        })
      }
      filteredItineraries(data)
      filter.forEach((itinerary) => {
        let newItinerary = new Itinerary(itinerary)
        let itineraryHtml = newItinerary.formatIndex()


        $('.search-itineraries').append(itineraryHtml)
      })
    })
  })

  // $(document).on('click', ".show-link", function(e) {
  //   e.preventDefault()
  //   let id = $(this).attr('data-id')
  //   fetch(`/itineraries/${id}.json`).then(res => res.json()).then(function(data) {
  //
  //   })
  // })
}

function Itinerary(itinerary) {
  this.id = itinerary.id
  this.title = itinerary.title
  this.description = itinerary.description
  this.budget = itinerary.budget
  this.departing_city = itinerary.departing_city
  this.departing_country = itinerary.departing_country
  this.reviews = itinerary.reviews
}

Itinerary.prototype.formatIndex = function() {
  let itineraryHtml = `
    <div class="itinerary">
      <a class="show-link" data-id="${this.id}" href="/itineraries/${this.id}"><h4>${this.title}</h4></a>

      <p>${this.description} </p>
      <p>Budget: $${this.budget}</p>
    </div>
  `
  return itineraryHtml
}
