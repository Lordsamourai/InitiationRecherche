FROM ruby:2.7

WORKDIR /app

COPY . .

RUN bundle install

EXPOSE 4567

CMD ["ruby", "app.rb"]