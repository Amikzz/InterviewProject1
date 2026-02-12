package lk.library_system.Dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.library_system.Entity.BookEntity;

public interface BooksDao extends JpaRepository<BookEntity, Integer> {

}
